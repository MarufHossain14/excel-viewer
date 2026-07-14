"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { SearchHighlight } from "@/components/forms/search-highlight";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FormResponse } from "@/types/workbook";

interface ResponseViewerProps {
  response: FormResponse;
  position: number;
  total: number;
  query: string;
  hideEmpty: boolean;
  compact: boolean;
  onPrevious: () => void;
  onNext: () => void;
  canPrevious: boolean;
  canNext: boolean;
}

export function ResponseViewer({
  response,
  position,
  total,
  query,
  hideEmpty,
  compact,
  onPrevious,
  onNext,
  canPrevious,
  canNext,
}: ResponseViewerProps) {
  const fields = hideEmpty
    ? response.fields.filter((field) => field.value !== null)
    : response.fields;

  return (
    <div className="mx-auto w-full max-w-5xl animate-rise-in">
      <div className="mb-5 flex items-center justify-between px-1">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">
            Response {position} of {total}
          </p>
          <p className="mt-1 text-xs text-muted">Spreadsheet row {response.rowNumber}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            size="icon"
            variant="secondary"
            onClick={onPrevious}
            disabled={!canPrevious}
            aria-label="Previous response"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            onClick={onNext}
            disabled={!canNext}
            aria-label="Next response"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <article
        className={cn(
          "rounded-[26px] border border-border-strong bg-surface-raised shadow-[var(--shadow)]",
          compact ? "p-6 sm:p-8" : "p-7 sm:p-10 lg:p-12",
        )}
        aria-label={`Response ${position}`}
      >
        {fields.length ? (
          <dl className={cn("grid grid-cols-1 sm:grid-cols-2", compact ? "gap-x-8 gap-y-6" : "gap-x-12 gap-y-9")}>
            {fields.map((field) => (
              <div
                key={field.id}
                className={cn(
                  "relative border-t border-border pt-4 first:border-t-0 sm:[&:nth-child(2)]:border-t-0",
                  field.isLong && "sm:col-span-2",
                )}
              >
                <dt className="mb-2 text-[11px] font-bold uppercase leading-4 tracking-[0.13em] text-muted">
                  <SearchHighlight text={field.label} query={query} />
                </dt>
                <dd
                  className={cn(
                    "whitespace-pre-wrap break-words text-[15px] leading-7 text-foreground",
                    field.isLong && "max-w-3xl font-serif text-base leading-8",
                    field.value === null && "italic text-muted-foreground",
                  )}
                >
                  <SearchHighlight
                    text={field.value === null ? "No answer" : String(field.value)}
                    query={query}
                  />
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <div className="py-20 text-center">
            <p className="font-serif text-xl">This response has no answers.</p>
            <p className="mt-2 text-sm text-muted">Empty fields are hidden in your settings.</p>
          </div>
        )}
      </article>

      <div className="mt-5 flex items-center justify-center gap-3 text-[11px] text-muted">
        <span className="rounded-md border bg-surface px-2 py-1 font-semibold">←</span>
        <span className="rounded-md border bg-surface px-2 py-1 font-semibold">→</span>
        Navigate responses
      </div>
    </div>
  );
}
