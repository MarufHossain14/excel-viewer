"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { SearchHighlight } from "@/components/forms/search-highlight";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FormResponse } from "@/types/workbook";
import type { ReactNode } from "react";

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
  reviewPanel?: ReactNode;
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
  reviewPanel,
}: ResponseViewerProps) {
  const fields = hideEmpty
    ? response.fields.filter((field) => field.value !== null)
    : response.fields;

  return (
    <div className="mx-auto w-full max-w-[980px] animate-rise-in">
      <div className="mb-6 flex items-center justify-between px-1">
        <div>
          <p className="text-[13px] font-extrabold tracking-[-0.01em] text-foreground">
            Response <span className="tabular-nums text-accent">{position}</span>
            <span className="font-medium text-muted"> of {total}</span>
          </p>
          <p className="mt-1 text-[12px] text-muted">Source row {response.rowNumber}</p>
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
          "relative overflow-hidden rounded-[28px] border border-border-strong bg-surface-raised shadow-[var(--shadow)] before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-white/70 dark:before:bg-white/10",
          compact ? "p-5 sm:p-7" : "p-6 sm:p-9 lg:p-11",
        )}
        aria-label={`Response ${position}`}
      >
        {fields.length ? (
          <dl className={cn("grid grid-cols-1 sm:grid-cols-2", compact ? "gap-3.5" : "gap-4 sm:gap-5")}>
            {fields.map((field) => (
              <div
                key={field.id}
                className={cn(
                  "relative rounded-2xl border border-border/85 bg-background/45 px-4 py-4 sm:px-5 sm:py-[18px]",
                  field.isLong && "sm:col-span-2",
                )}
              >
                <dt className="mb-2.5 flex items-start gap-2 text-[12px] font-bold leading-5 tracking-[-0.005em] text-muted">
                  <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-accent/65" aria-hidden="true" />
                  <SearchHighlight text={field.label} query={query} />
                </dt>
                <dd
                  className={cn(
                    "whitespace-pre-wrap break-words pl-3.5 text-base font-medium leading-7 tracking-[-0.008em] text-foreground",
                    field.isLong && "max-w-[74ch] font-serif text-lg font-normal leading-[1.78] tracking-[-0.01em]",
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
      {reviewPanel}

      <div className="mt-6 flex items-center justify-center gap-2.5 text-[12px] text-muted">
        <span className="rounded-md border bg-surface-raised px-2 py-1 font-semibold shadow-sm">←</span>
        <span className="rounded-md border bg-surface-raised px-2 py-1 font-semibold shadow-sm">→</span>
        Navigate responses
      </div>
    </div>
  );
}
