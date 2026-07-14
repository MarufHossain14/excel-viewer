"use client";

import { BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { FormResponse, ReviewState } from "@/types/workbook";

export function StatisticsDialog({ responses, reviews }: { responses: FormResponse[]; reviews: Record<string, ReviewState> }) {
  const responseReviews = responses.map((response) => reviews[response.id]).filter(Boolean);
  const reviewed = responseReviews.filter((review) => review.reviewed).length;
  const ratings = responseReviews.filter((review) => review.rating > 0).map((review) => review.rating);
  const average = ratings.length ? ratings.reduce((total, rating) => total + rating, 0) / ratings.length : 0;
  const completion = responses.length ? Math.round((reviewed / responses.length) * 100) : 0;
  const metrics = [
    ["Total responses", responses.length],
    ["Reviewed", reviewed],
    ["Remaining", Math.max(0, responses.length - reviewed)],
    ["Average rating", average ? average.toFixed(1) : "—"],
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon-sm" variant="ghost" aria-label="View statistics"><BarChart3 className="size-4" /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review progress</DialogTitle>
          <DialogDescription>A live summary of the current worksheet.</DialogDescription>
        </DialogHeader>
        <div className="rounded-2xl border bg-background p-5">
          <div className="flex items-end justify-between">
            <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Completion</p><p className="mt-1 font-serif text-4xl">{completion}%</p></div>
            <p className="text-sm text-muted">{reviewed} of {responses.length}</p>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-border"><div className="h-full rounded-full bg-accent transition-[width]" style={{ width: `${completion}%` }} /></div>
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-3">
          {metrics.map(([label, value]) => <div key={label} className="rounded-2xl border p-4"><dt className="text-xs text-muted">{label}</dt><dd className="mt-1 text-xl font-semibold">{value}</dd></div>)}
        </dl>
      </DialogContent>
    </Dialog>
  );
}
