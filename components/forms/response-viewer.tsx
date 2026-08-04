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
    <div className="mx-auto w-full max-w-[840px] animate-rise-in pb-8">
      <div className="mb-4 flex min-h-8 items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold">Response {position} <span className="font-normal text-muted">of {total}</span></p>
          <p className="mt-0.5 text-xs text-muted">Spreadsheet row {response.rowNumber}</p>
        </div>
        <div className="flex shrink-0 gap-1.5">
          <Button size="icon-sm" variant="secondary" onClick={onPrevious} disabled={!canPrevious} aria-label="Previous response">
            <ChevronLeft className="size-4" aria-hidden="true" />
          </Button>
          <Button size="icon-sm" variant="secondary" onClick={onNext} disabled={!canNext} aria-label="Next response">
            <ChevronRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <article
        className={cn(
          "overflow-hidden rounded-xl border bg-surface-raised shadow-[var(--shadow-soft)]",
          compact ? "px-5 sm:px-6" : "px-5 sm:px-8",
        )}
        aria-label={`Response ${position}`}
      >
        {fields.length ? (
          <dl className="divide-y">
            {fields.map((field) => (
              <div
                key={field.id}
                className={cn(
                  "grid gap-1.5 py-5 sm:grid-cols-[minmax(140px,0.32fr)_minmax(0,1fr)] sm:items-start sm:gap-8",
                  compact && "py-4",
                  field.isLong && "sm:grid-cols-1 sm:gap-1.5",
                )}
              >
                <dt className="break-words text-[13px] font-medium leading-5 text-muted sm:pr-2">
                  <SearchHighlight text={field.label} query={query} />
                </dt>
                <dd className={cn(
                  "response-answer whitespace-pre-wrap break-words leading-7",
                  field.isLong && "response-answer-long max-w-[76ch]",
                  field.value === null && "italic text-muted-foreground",
                )}>
                  <SearchHighlight text={field.value === null ? "No answer" : String(field.value)} query={query} />
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <div className="py-14 text-center">
            <p className="font-medium">No answers to show</p>
            <p className="mt-1 text-sm text-muted">Empty answers are hidden in preferences.</p>
          </div>
        )}
      </article>

      {reviewPanel}
    </div>
  );
}
