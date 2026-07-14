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
    <section className="mt-4 rounded-[20px] border border-border-strong bg-surface-raised p-4 shadow-sm sm:p-5" aria-label="Private review">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant={review.reviewed ? "default" : "secondary"}
          onClick={onReviewed}
          aria-pressed={review.reviewed}
        >
          <Check className="size-4" />
          {review.reviewed ? "Reviewed" : "Mark reviewed"}
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className={cn(review.starred && "border-[#d4ad50] text-[#b17d10]")}
          onClick={() => onChange({ starred: !review.starred })}
          aria-label={review.starred ? "Remove star" : "Star response"}
          aria-pressed={review.starred}
        >
          <Star className={cn("size-4", review.starred && "fill-current")} />
        </Button>
        <div className="ml-auto flex items-center gap-1" aria-label="Rating">
          <span className="mr-2 hidden text-[11px] font-bold uppercase tracking-[0.12em] text-muted sm:inline">Rating</span>
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              className="rounded-md p-1 text-[#c5962d] transition-transform hover:scale-110"
              onClick={() => onChange({ rating: review.rating === rating ? 0 : rating })}
              aria-label={`${rating} star${rating === 1 ? "" : "s"}`}
              aria-pressed={review.rating === rating}
            >
              <Star className={cn("size-[18px]", rating <= review.rating && "fill-current")} />
            </button>
          ))}
        </div>
      </div>
      <label className="mt-4 block">
        <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-muted">Private notes</span>
        <textarea
          value={review.notes}
          onChange={(event) => onChange({ notes: event.target.value })}
          placeholder="Add context, follow-up questions, or a reminder…"
          rows={3}
          className="w-full resize-y rounded-xl border bg-background/70 px-3.5 py-3 text-sm leading-6 outline-none placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/15"
        />
      </label>
    </section>
  );
}
