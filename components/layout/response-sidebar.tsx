"use client";

import { useEffect } from "react";
import { Check, Search, Star } from "lucide-react";
import { SearchHighlight } from "@/components/forms/search-highlight";
import { useVirtualList } from "@/hooks/use-virtual-list";
import { cn } from "@/lib/utils";
import type { FormResponse, ReviewState } from "@/types/workbook";

interface ResponseSidebarProps {
  responses: FormResponse[];
  totalResponses: number;
  currentId: string | null;
  query: string;
  reviews: Record<string, ReviewState>;
  onQueryChange: (query: string) => void;
  onSelect: (id: string) => void;
}

function responseIdentity(response: FormResponse) {
  const populated = response.fields.filter((field) => field.value !== null);
  return {
    title: populated[0]?.searchValue || `Response ${response.rowNumber - 1}`,
    subtitle: populated[1]?.searchValue || `Row ${response.rowNumber}`,
  };
}

export function ResponseSidebar({
  responses,
  totalResponses,
  currentId,
  query,
  reviews,
  onQueryChange,
  onSelect,
}: ResponseSidebarProps) {
  const { containerRef, range, totalHeight, onScroll, scrollToIndex } = useVirtualList(
    responses.length,
    72,
  );
  const currentIndex = responses.findIndex((response) => response.id === currentId);

  useEffect(() => scrollToIndex(currentIndex), [currentIndex, scrollToIndex]);

  return (
    <aside className="flex min-h-0 flex-col border-b bg-surface/92 md:border-b-0 md:border-r" aria-label="Response navigation">
      <div className="border-b px-4 pb-4 pt-5">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="text-[13px] font-extrabold tracking-[-0.02em]">Responses</p>
            <p className="mt-1 text-[12px] text-muted">
              {query ? `${responses.length} of ${totalResponses} found` : `${totalResponses} total`}
            </p>
          </div>
        </div>
        <label className="relative block">
          <span className="sr-only">Search all responses</span>
          <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted" />
          <input
            type="search"
            name="response-search"
            autoComplete="off"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search every answer…"
            className="h-10 w-full rounded-xl border bg-surface-raised pl-9 pr-3 text-[13px] shadow-sm outline-none placeholder:text-muted-foreground focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/15"
          />
        </label>
      </div>

      <div ref={containerRef} onScroll={onScroll} className="min-h-0 flex-1 overflow-y-auto" role="listbox" aria-label="Responses">
        {responses.length ? (
          <div className="relative mx-2" style={{ height: totalHeight }}>
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
                  "absolute left-0 flex h-[66px] w-full items-start gap-3 rounded-xl border border-transparent px-3 py-3 text-left transition-[background-color,border-color,box-shadow]",
                  selected ? "border-accent/20 bg-accent-soft text-foreground shadow-sm" : "hover:bg-background/85",
                )}
                style={{ top: index * 72 }}
                onClick={() => onSelect(response.id)}
              >
                <span
                  className={cn(
                    "mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg border text-[11px] font-bold tabular-nums",
                    review?.reviewed
                      ? "border-accent bg-accent text-accent-foreground"
                      : "bg-surface-raised text-muted",
                  )}
                >
                  {review?.reviewed ? <Check className="size-3.5" /> : index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span className="truncate text-[13px] font-bold tracking-[-0.01em]">
                      <SearchHighlight text={title} query={query} />
                    </span>
                    {review?.starred && <Star className="size-3 fill-current text-[#c5962d]" />}
                  </span>
                  <span className="mt-1 block truncate text-[12px] text-muted">
                    <SearchHighlight text={subtitle} query={query} />
                  </span>
                </span>
              </button>
            );
          })}
          </div>
        ) : (
          <div className="px-4 py-12 text-center">
            <p className="text-sm font-semibold">No matching responses</p>
            <p className="mt-1 text-xs leading-5 text-muted">Try a different name, email, or answer.</p>
          </div>
        )}
      </div>
    </aside>
  );
}
