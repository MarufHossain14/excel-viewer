import type { FormResponse, ReviewState } from "@/types/workbook";

const MAX_FILTER_VALUES = 50;
const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

export type ReviewFilter = "all" | "unreviewed" | "reviewed" | "starred";
export type SortDirection = "asc" | "desc";

export interface ResponseViewOptions {
  reviewFilter: ReviewFilter;
  filterFieldId: string | null;
  selectedValues: string[];
  sortKey: string;
  sortDirection: SortDirection;
}

export interface FilterValue {
  key: string;
  label: string;
  count: number;
}

export interface FilterableColumn {
  id: string;
  label: string;
  values: FilterValue[];
}

export function createDefaultResponseView(): ResponseViewOptions {
  return {
    reviewFilter: "all",
    filterFieldId: null,
    selectedValues: [],
    sortKey: "original",
    sortDirection: "asc",
  };
}

export function normalizeFilterValue(value: string) {
  return value.trim().toLocaleLowerCase();
}

export function getFilterableColumns(responses: FormResponse[]): FilterableColumn[] {
  const fields = responses[0]?.fields ?? [];

  return fields.flatMap((field) => {
    const values = new Map<string, FilterValue>();

    for (const response of responses) {
      const value = response.fields.find((candidate) => candidate.id === field.id)?.searchValue.trim();
      if (!value) continue;

      const key = normalizeFilterValue(value);
      const existing = values.get(key);
      if (existing) existing.count += 1;
      else values.set(key, { key, label: value, count: 1 });

      if (values.size > MAX_FILTER_VALUES) return [];
    }

    if (values.size < 2) return [];

    return [{
      id: field.id,
      label: field.label,
      values: [...values.values()].sort((left, right) => collator.compare(left.label, right.label)),
    }];
  });
}

export function isResponseViewActive(options: ResponseViewOptions) {
  return (
    options.reviewFilter !== "all"
    || options.selectedValues.length > 0
    || options.sortKey !== "original"
  );
}

function fieldValue(response: FormResponse, fieldId: string) {
  return response.fields.find((field) => field.id === fieldId)?.searchValue.trim() ?? "";
}

function compareOptionalValues(left: string, right: string, direction: SortDirection) {
  if (!left && !right) return 0;
  if (!left) return 1;
  if (!right) return -1;
  const result = collator.compare(left, right);
  return direction === "asc" ? result : -result;
}

export function applyResponseView(
  responses: FormResponse[],
  reviews: Record<string, ReviewState>,
  query: string,
  options: ResponseViewOptions,
) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const selectedValues = new Set(options.selectedValues);

  const visible = responses.filter((response) => {
    if (normalizedQuery && !response.searchText.includes(normalizedQuery)) return false;

    const review = reviews[response.id];
    if (options.reviewFilter === "unreviewed" && review?.reviewed) return false;
    if (options.reviewFilter === "reviewed" && !review?.reviewed) return false;
    if (options.reviewFilter === "starred" && !review?.starred) return false;

    if (options.filterFieldId && selectedValues.size > 0) {
      const value = normalizeFilterValue(fieldValue(response, options.filterFieldId));
      if (!selectedValues.has(value)) return false;
    }

    return true;
  });

  if (options.sortKey === "original") return visible;

  return [...visible].sort((left, right) => {
    let result = 0;

    if (options.sortKey === "reviewed") {
      result = Number(Boolean(reviews[left.id]?.reviewed)) - Number(Boolean(reviews[right.id]?.reviewed));
    } else if (options.sortKey === "starred") {
      result = Number(Boolean(reviews[left.id]?.starred)) - Number(Boolean(reviews[right.id]?.starred));
    } else if (options.sortKey === "rating") {
      result = (reviews[left.id]?.rating ?? 0) - (reviews[right.id]?.rating ?? 0);
    } else if (options.sortKey.startsWith("field:")) {
      const fieldId = options.sortKey.slice("field:".length);
      result = compareOptionalValues(
        fieldValue(left, fieldId),
        fieldValue(right, fieldId),
        options.sortDirection,
      );
      return result || left.rowNumber - right.rowNumber;
    }

    if (options.sortDirection === "desc") result *= -1;
    return result || left.rowNumber - right.rowNumber;
  });
}
