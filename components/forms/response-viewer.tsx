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
    <div className="mx-auto w-full max-w-[960px] animate-rise-in">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">
            Response <span className="font-mono tabular-nums">{position}</span>
            <span className="font-normal text-muted"> of {total}</span>
          </p>
          <p className="mt-0.5 text-xs text-muted">Source row {response.rowNumber}</p>
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
          "rounded-xl border border-border bg-surface-raised shadow-[var(--shadow-soft)]",
          compact ? "px-5 sm:px-7" : "px-6 sm:px-9 lg:px-10",
        )}
        aria-label={`Response ${position}`}
      >
        {fields.length ? (
          <dl className={cn("grid grid-cols-1 sm:grid-cols-2", compact ? "gap-x-7" : "gap-x-10")}>
            {fields.map((field) => (
              <div
                key={field.id}
                className={cn(
                  "border-t border-border py-5 first:border-t-0 sm:[&:nth-child(2)]:border-t-0",
                  field.isLong && "sm:col-span-2",
                )}
              >
                <dt className="mb-2 text-[13px] font-medium leading-5 text-muted">
                  <SearchHighlight text={field.label} query={query} />
                </dt>
                <dd
                  className={cn(
                    "whitespace-pre-wrap break-words text-base font-normal leading-7 text-foreground",
                    field.isLong && "max-w-[76ch] text-[17px] leading-8",
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
            <p className="text-lg font-semibold">This response has no answers.</p>
            <p className="mt-2 text-sm text-muted">Empty fields are hidden in your settings.</p>
          </div>
        )}
      </article>
      {reviewPanel}

      <div className="mt-5 flex items-center justify-center gap-2.5 text-xs text-muted">
        <span className="rounded-md border bg-surface-raised px-2 py-1 font-mono">←</span>
        <span className="rounded-md border bg-surface-raised px-2 py-1 font-mono">→</span>
        Navigate responses
      </div>
    </div>
  );
}
