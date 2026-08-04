"use client";

import { useEffect } from "react";
import { Check, ChevronDown, Search, Star, X } from "lucide-react";
import { ResponseControlsDialog } from "@/components/forms/response-controls-dialog";
import { SearchHighlight } from "@/components/forms/search-highlight";
import { useVirtualList } from "@/hooks/use-virtual-list";
import { cn } from "@/lib/utils";
import {
  isDateOrTimeField,
  type ResponseViewOptions,
  type ReviewFilter,
} from "@/lib/response-view";
import type { FormResponse, ReviewState } from "@/types/workbook";

interface ResponseSidebarProps {
  responses: FormResponse[];
  allResponses: FormResponse[];
  totalResponses: number;
  currentId: string | null;
  query: string;
  reviews: Record<string, ReviewState>;
  viewOptions: ResponseViewOptions;
  isFiltered: boolean;
  onQueryChange: (query: string) => void;
  onViewOptionsChange: (options: ResponseViewOptions) => void;
  onClearView: () => void;
  onSelect: (id: string) => void;
}

function responseIdentity(response: FormResponse) {
  const populated = response.fields.filter((field) => field.value !== null);
  const useful = populated.filter(
    (field) => !isDateOrTimeField(field.originalLabel),
  );
  const titleField =
    useful.find((field) => /\b(?:full )?name\b/i.test(field.originalLabel))
    ?? useful.find((field) => /\be-?mail\b/i.test(field.originalLabel))
    ?? useful.find((field) => !field.isLong)
    ?? useful[0]
    ?? populated[0];
  const subtitleField = useful.find(
    (field) => field.id !== titleField?.id && !field.isLong,
  );

  return {
    title: titleField?.searchValue || `Response ${response.rowNumber - 1}`,
    subtitle: subtitleField?.searchValue || `Spreadsheet row ${response.rowNumber}`,
  };
}

const QUICK_FILTERS: Array<{ value: ReviewFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "unreviewed", label: "Open" },
  { value: "reviewed", label: "Done" },
  { value: "starred", label: "Starred" },
];

export function ResponseSidebar({
  responses,
  allResponses,
  totalResponses,
  currentId,
  query,
  reviews,
  viewOptions,
  isFiltered,
  onQueryChange,
  onViewOptionsChange,
  onClearView,
  onSelect,
}: ResponseSidebarProps) {
  const { containerRef, range, totalHeight, onScroll, scrollToIndex } = useVirtualList(
    responses.length,
    68,
  );
  const currentIndex = responses.findIndex((response) => response.id === currentId);

  useEffect(() => scrollToIndex(currentIndex), [currentIndex, scrollToIndex]);

  function setQuickFilter(reviewFilter: ReviewFilter) {
    onViewOptionsChange({ ...viewOptions, reviewFilter });
  }

  return (
    <aside className="flex min-h-0 flex-col border-b bg-surface-raised md:border-b-0 md:border-r" aria-label="Response navigation">
      <div className="border-b px-3 py-3 sm:px-4 md:py-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold">Responses</h2>
            <p className="mt-0.5 text-[11px] text-muted">
              {isFiltered ? `${responses.length} of ${totalResponses} shown` : `${totalResponses} total`}
            </p>
          </div>
          <ResponseControlsDialog
            responses={allResponses}
            options={viewOptions}
            onChange={onViewOptionsChange}
            onReset={() => onViewOptionsChange({
              reviewFilter: "all",
              filterFieldId: null,
              selectedValues: [],
              sortKey: "original",
              sortDirection: "asc",
            })}
          />
        </div>

        <label className="relative block">
          <span className="sr-only">Search every answer</span>
          <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted" aria-hidden="true" />
          <input
            type="search"
            name="response-search"
            autoComplete="off"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search responses…"
            className="h-9 w-full rounded-lg border bg-background pl-9 pr-8 text-[13px] text-foreground placeholder:text-muted-foreground focus-visible:border-ring"
          />
          {query && (
            <button
              type="button"
              className="absolute right-1.5 top-1.5 rounded-md p-1 text-muted hover:bg-accent-soft hover:text-foreground"
              onClick={() => onQueryChange("")}
              aria-label="Clear search"
            >
              <X className="size-3.5" />
            </button>
          )}
        </label>

        <div className="mt-2 grid grid-cols-4 gap-1 rounded-lg bg-surface p-1" role="group" aria-label="Filter by review status">
          {QUICK_FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              className={cn(
                "whitespace-nowrap rounded-md px-1 py-1.5 text-[11px] font-medium transition-colors",
                viewOptions.reviewFilter === filter.value
                  ? "bg-surface-raised text-foreground shadow-sm"
                  : "text-muted hover:text-foreground",
              )}
              onClick={() => setQuickFilter(filter.value)}
              aria-pressed={viewOptions.reviewFilter === filter.value}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {responses.length > 0 && (
          <label className="relative mt-2 block md:hidden">
            <span className="sr-only">Current response</span>
            <select
              name="current-response"
              value={currentIndex >= 0 ? responses[currentIndex].id : responses[0].id}
              onChange={(event) => onSelect(event.target.value)}
              className="h-10 w-full appearance-none rounded-lg border bg-surface-raised pl-3 pr-8 text-sm font-medium text-foreground focus-visible:border-ring"
            >
              {responses.map((response, index) => {
                const { title } = responseIdentity(response);
                return <option key={response.id} value={response.id}>{index + 1}. {title}</option>;
              })}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3 size-4 text-muted" aria-hidden="true" />
          </label>
        )}
      </div>

      <div ref={containerRef} onScroll={onScroll} className="scroll-region hidden min-h-0 flex-1 overflow-y-auto md:block" role="listbox" aria-label="Responses">
        {responses.length ? (
          <div className="relative" style={{ height: totalHeight }}>
            {responses.slice(range.start, range.end).map((response, visibleIndex) => {
              const index = range.start + visibleIndex;
              const { title, subtitle } = responseIdentity(response);
              const review = reviews[response.id];
              const selected = currentId === response.id;
              return (
                <button
                  key={response.id}
                  role="option"
                  aria-selected={selected}
                  aria-posinset={index + 1}
                  aria-setsize={responses.length}
                  type="button"
                  className={cn(
                    "absolute left-2 flex h-16 w-[calc(100%-1rem)] items-center gap-2.5 rounded-lg border px-2.5 text-left transition-colors",
                    selected
                      ? "border-border-strong bg-accent-soft"
                      : "border-transparent hover:bg-surface",
                  )}
                  style={{ top: index * 68 + 2 }}
                  onClick={() => onSelect(response.id)}
                >
                  <span className={cn(
                    "grid size-7 shrink-0 place-items-center rounded-md border bg-surface-raised text-[11px] tabular-nums text-muted",
                    review?.reviewed && "border-accent/20 text-accent",
                  )}>
                    {review?.reviewed ? <Check className="size-3.5" aria-hidden="true" /> : index + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      <span className="truncate text-[13px] font-medium">
                        <SearchHighlight text={title} query={query} />
                      </span>
                      {review?.starred && (
                        <>
                          <Star className="size-3 shrink-0 fill-current text-accent" aria-hidden="true" />
                          <span className="sr-only">Starred</span>
                        </>
                      )}
                    </span>
                    <span className="mt-0.5 block truncate text-[11px] text-muted">
                      <SearchHighlight text={subtitle} query={query} />
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="px-4 py-10 text-center">
            <p className="text-sm font-medium">No responses found</p>
            <p className="mt-1 text-xs text-muted">Try another search or filter.</p>
            {isFiltered && (
              <button type="button" className="mt-3 text-xs font-medium text-accent underline underline-offset-4" onClick={onClearView}>
                Show everything
              </button>
            )}
          </div>
        )}
      </div>

      {responses.length === 0 && (
        <div className="px-4 py-5 text-center md:hidden">
          <p className="text-sm font-medium">No responses found</p>
          {isFiltered && (
            <button type="button" className="mt-2 text-xs font-medium text-accent underline underline-offset-4" onClick={onClearView}>
              Show everything
            </button>
          )}
        </div>
      )}
    </aside>
  );
}
