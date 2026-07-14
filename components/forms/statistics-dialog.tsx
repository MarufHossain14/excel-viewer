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
          <DialogTitle>Review Progress</DialogTitle>
          <DialogDescription>A live summary of the current worksheet.</DialogDescription>
        </DialogHeader>
        <div className="rounded-2xl border bg-background/65 p-5 shadow-inner">
          <div className="flex items-end justify-between">
            <div><p className="text-[12px] font-bold text-muted">Completion</p><p className="mt-1 font-serif text-5xl tabular-nums tracking-[-0.04em]">{completion}%</p></div>
            <p className="text-sm tabular-nums text-muted">{reviewed} of {responses.length}</p>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-border"><div className="h-full rounded-full bg-accent transition-[width]" style={{ width: `${completion}%` }} /></div>
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-3">
          {metrics.map(([label, value]) => <div key={label} className="rounded-2xl border bg-background/35 p-4"><dt className="text-[12px] font-medium text-muted">{label}</dt><dd className="mt-1 text-2xl font-bold tabular-nums tracking-[-0.03em]">{value}</dd></div>)}
        </dl>
      </DialogContent>
    </Dialog>
  );
}
