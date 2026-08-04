"use client";

import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ReviewState } from "@/types/workbook";

interface ReviewPanelProps {
  review: ReviewState;
  onChange: (update: Partial<ReviewState>) => void;
  onReviewed: () => void;
}

export function ReviewPanel({ review, onChange, onReviewed }: ReviewPanelProps) {
  return (
    <section className="mt-4 rounded-xl border bg-surface-raised p-4 shadow-[var(--shadow-soft)]" aria-label="Review notes">
      <textarea
        name="private-notes"
        aria-label="Private note"
        autoComplete="off"
        value={review.notes}
        onChange={(event) => onChange({ notes: event.target.value })}
        placeholder="Add a private note (optional)…"
        rows={2}
        className="w-full resize-y rounded-lg border bg-background px-3 py-2.5 text-sm leading-6 placeholder:text-muted-foreground focus-visible:border-ring"
      />

      <div className="mt-3 grid grid-cols-[auto_1fr] items-center gap-2 sm:flex">
        <Button
          variant="secondary"
          size="sm"
          className={cn(review.starred && "border-accent bg-accent-soft text-accent")}
          onClick={() => onChange({ starred: !review.starred })}
          aria-pressed={review.starred}
        >
          <Star className={cn("size-3.5", review.starred && "fill-current")} aria-hidden="true" />
          {review.starred ? "Starred" : "Star"}
        </Button>

        <div className="flex items-center justify-end gap-0.5 sm:justify-start" aria-label="Optional rating">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              className="rounded p-1 text-muted transition-colors hover:text-accent"
              onClick={() => onChange({ rating: review.rating === rating ? 0 : rating })}
              aria-label={`${rating} star${rating === 1 ? "" : "s"}`}
              aria-pressed={review.rating === rating}
            >
              <Star className={cn("size-4", rating <= review.rating && "fill-current text-accent")} aria-hidden="true" />
            </button>
          ))}
        </div>

        <Button
          className="col-span-2 w-full sm:ml-auto sm:w-auto"
          variant={review.reviewed ? "secondary" : "default"}
          onClick={onReviewed}
          aria-pressed={review.reviewed}
        >
          <Check className="size-4" aria-hidden="true" />
          {review.reviewed ? "Finished" : "Mark Finished"}
        </Button>
      </div>
    </section>
  );
}
