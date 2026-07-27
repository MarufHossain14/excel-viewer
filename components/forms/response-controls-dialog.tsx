"use client";

import { useMemo } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  getFilterableColumns,
  isResponseViewActive,
  type ResponseViewOptions,
  type SortDirection,
} from "@/lib/response-view";
import { cn } from "@/lib/utils";
import type { FormResponse } from "@/types/workbook";

interface ResponseControlsDialogProps {
  responses: FormResponse[];
  options: ResponseViewOptions;
  onChange: (options: ResponseViewOptions) => void;
  onReset: () => void;
}

function directionLabels(sortKey: string): [string, string] {
  if (sortKey === "rating") return ["Lowest first", "Highest first"];
  if (sortKey === "reviewed") return ["Unreviewed first", "Reviewed first"];
  if (sortKey === "starred") return ["Unstarred first", "Starred first"];
  return ["A–Z", "Z–A"];
}

function defaultDirection(sortKey: string): SortDirection {
  if (sortKey === "rating" || sortKey === "starred") return "desc";
  return "asc";
}

export function ResponseControlsDialog({
  responses,
  options,
  onChange,
  onReset,
}: ResponseControlsDialogProps) {
  const fields = responses[0]?.fields ?? [];
  const filterableColumns = useMemo(
    () => getFilterableColumns(responses),
    [responses],
  );
  const selectedColumn = filterableColumns.find((column) => column.id === options.filterFieldId);
  const active = isResponseViewActive(options);
  const filterCount =
    Number(options.reviewFilter !== "all")
    + Number(options.selectedValues.length > 0);
  const [ascendingLabel, descendingLabel] = directionLabels(options.sortKey);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant={active ? "secondary" : "ghost"}
          className="relative h-8 px-2.5"
        >
          <SlidersHorizontal className="size-3.5" aria-hidden="true" />
          Organize
          {filterCount > 0 && (
            <span className="grid min-w-4 place-items-center rounded-full bg-foreground px-1 text-[10px] leading-4 text-background">
              {filterCount}
            </span>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Filter & Sort Responses</DialogTitle>
          <DialogDescription>
            Narrow the review queue without changing the original spreadsheet.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 sm:grid-cols-2">
          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">
              Filter
            </legend>

            <label className="mt-3 block">
              <span className="text-[13px] font-medium">Review status</span>
              <select
                value={options.reviewFilter}
                onChange={(event) => onChange({
                  ...options,
                  reviewFilter: event.target.value as ResponseViewOptions["reviewFilter"],
                })}
                className="mt-2 h-10 w-full rounded-lg border bg-surface-raised px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
              >
                <option value="all">Any status</option>
                <option value="unreviewed">Unreviewed</option>
                <option value="reviewed">Reviewed</option>
                <option value="starred">Starred</option>
              </select>
            </label>

            <label className="mt-4 block">
              <span className="text-[13px] font-medium">Response field</span>
              <select
                value={options.filterFieldId ?? ""}
                onChange={(event) => onChange({
                  ...options,
                  filterFieldId: event.target.value || null,
                  selectedValues: [],
                })}
                className="mt-2 h-10 w-full rounded-lg border bg-surface-raised px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
              >
                <option value="">Choose a field</option>
                {filterableColumns.map((column) => (
                  <option key={column.id} value={column.id}>{column.label}</option>
                ))}
              </select>
            </label>

            {selectedColumn ? (
              <div className="mt-3 max-h-52 overflow-y-auto rounded-lg border bg-surface px-3">
                {selectedColumn.values.map((value) => {
                  const checked = options.selectedValues.includes(value.key);
                  return (
                    <label
                      key={value.key}
                      className="flex min-h-10 items-center gap-3 border-b py-2 last:border-b-0"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => onChange({
                          ...options,
                          selectedValues: checked
                            ? options.selectedValues.filter((candidate) => candidate !== value.key)
                            : [...options.selectedValues, value.key],
                        })}
                        className="size-4 accent-[var(--accent)]"
                      />
                      <span className="min-w-0 flex-1 truncate text-[13px]">{value.label}</span>
                      <span className="font-mono text-xs tabular-nums text-muted">{value.count}</span>
                    </label>
                  );
                })}
              </div>
            ) : (
              <p className="mt-3 text-xs leading-5 text-muted">
                Fields with 2–50 distinct values appear here, making categories such as positions easy to filter.
              </p>
            )}
          </fieldset>

          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">
              Sort
            </legend>

            <label className="mt-3 block">
              <span className="text-[13px] font-medium">Sort responses by</span>
              <select
                value={options.sortKey}
                onChange={(event) => {
                  const sortKey = event.target.value;
                  onChange({ ...options, sortKey, sortDirection: defaultDirection(sortKey) });
                }}
                className="mt-2 h-10 w-full rounded-lg border bg-surface-raised px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
              >
                <option value="original">Original spreadsheet order</option>
                <optgroup label="Review">
                  <option value="reviewed">Review status</option>
                  <option value="starred">Starred status</option>
                  <option value="rating">Rating</option>
                </optgroup>
                {fields.length > 0 && (
                  <optgroup label="Response fields">
                    {fields.map((field) => (
                      <option key={field.id} value={`field:${field.id}`}>{field.label}</option>
                    ))}
                  </optgroup>
                )}
              </select>
            </label>

            {options.sortKey !== "original" && (
              <div className="mt-4">
                <p className="text-[13px] font-medium">Direction</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {([
                    ["asc", ascendingLabel],
                    ["desc", descendingLabel],
                  ] as Array<[SortDirection, string]>).map(([direction, label]) => (
                    <button
                      key={direction}
                      type="button"
                      onClick={() => onChange({ ...options, sortDirection: direction })}
                      className={cn(
                        "min-h-10 rounded-lg border bg-surface-raised px-3 text-[13px] font-medium transition-colors hover:bg-accent-soft",
                        options.sortDirection === direction
                          && "border-foreground bg-accent-soft",
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5 rounded-lg border bg-surface p-4 text-xs leading-5 text-muted">
              Notes, stars, and ratings stay attached to the same response when its position changes.
            </div>
          </fieldset>
        </div>

        <div className="mt-7 flex items-center justify-between border-t pt-5">
          <Button variant="ghost" onClick={onReset} disabled={!active}>
            Reset
          </Button>
          <DialogTrigger asChild>
            <Button>Show responses</Button>
          </DialogTrigger>
        </div>
      </DialogContent>
    </Dialog>
  );
}
