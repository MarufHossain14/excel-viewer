"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import { Download, Inbox } from "lucide-react";
import { ResponseViewer } from "@/components/forms/response-viewer";
import { ReviewPanel } from "@/components/forms/review-panel";
import { SettingsDialog } from "@/components/forms/settings-dialog";
import { StatisticsDialog } from "@/components/forms/statistics-dialog";
import { AppHeader } from "@/components/layout/app-header";
import { ResponseSidebar } from "@/components/layout/response-sidebar";
import { Button } from "@/components/ui/button";
import { exportReviews } from "@/lib/export-reviews";
import { useAppStore } from "@/store/use-app-store";
import type { ReviewState } from "@/types/workbook";

const EMPTY_REVIEW: ReviewState = {
  reviewed: false,
  starred: false,
  rating: 0,
  notes: "",
  updatedAt: 0,
};

export function Workspace() {
  const workbook = useAppStore((state) => state.workbook);
  const selectedSheetId = useAppStore((state) => state.selectedSheetId);
  const currentResponseId = useAppStore((state) => state.currentResponseId);
  const reviews = useAppStore((state) => state.reviews);
  const settings = useAppStore((state) => state.settings);
  const selectSheet = useAppStore((state) => state.selectSheet);
  const selectResponse = useAppStore((state) => state.selectResponse);
  const clearWorkbook = useAppStore((state) => state.clearWorkbook);
  const updateReview = useAppStore((state) => state.updateReview);
  const updateSettings = useAppStore((state) => state.updateSettings);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const sheet = workbook?.sheets.find((candidate) => candidate.id === selectedSheetId);
  const filteredResponses = useMemo(() => {
    const normalized = deferredQuery.trim().toLocaleLowerCase();
    if (!normalized) return sheet?.responses ?? [];
    return (sheet?.responses ?? []).filter((response) => response.searchText.includes(normalized));
  }, [deferredQuery, sheet]);

  const currentIndex = filteredResponses.findIndex((response) => response.id === currentResponseId);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const currentResponse = filteredResponses[safeIndex];

  useEffect(() => {
    if (filteredResponses.length && currentIndex < 0) selectResponse(filteredResponses[0].id);
  }, [currentIndex, filteredResponses, selectResponse]);

  const navigate = useCallback(
    (offset: number) => {
      const nextIndex = Math.min(
        filteredResponses.length - 1,
        Math.max(0, safeIndex + offset),
      );
      const next = filteredResponses[nextIndex];
      if (next) selectResponse(next.id);
    },
    [filteredResponses, safeIndex, selectResponse],
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return;
      if (event.key === "ArrowLeft") navigate(-1);
      if (event.key === "ArrowRight") navigate(1);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  if (!workbook || !selectedSheetId || !sheet) return null;

  return (
    <main className="flex h-screen min-h-[620px] flex-col overflow-hidden bg-background">
      <AppHeader
        workbook={workbook}
        selectedSheetId={selectedSheetId}
        onSelectSheet={(id) => {
          setQuery("");
          selectSheet(id);
        }}
        onReset={() => void clearWorkbook()}
      >
        <StatisticsDialog responses={sheet.responses} reviews={reviews} />
        <Button size="icon-sm" variant="ghost" onClick={() => exportReviews(workbook, reviews)} aria-label="Export review data">
          <Download className="size-4" />
        </Button>
        <SettingsDialog settings={settings} onChange={updateSettings} />
      </AppHeader>
      <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[220px_1fr] md:grid-cols-[240px_1fr] md:grid-rows-1 lg:grid-cols-[288px_1fr]">
        <ResponseSidebar
          responses={filteredResponses}
          totalResponses={sheet.responses.length}
          currentId={currentResponseId}
          query={query}
          reviews={reviews}
          onQueryChange={setQuery}
          onSelect={selectResponse}
        />
        <section className="min-h-0 overflow-y-auto px-5 py-7 sm:px-8 lg:px-12 lg:py-10" aria-live="polite">
          {currentResponse ? (
            <ResponseViewer
              key={currentResponse.id}
              response={currentResponse}
              position={safeIndex + 1}
              total={filteredResponses.length}
              query={deferredQuery}
              hideEmpty={settings.hideEmptyAnswers}
              compact={settings.compactMode}
              onPrevious={() => navigate(-1)}
              onNext={() => navigate(1)}
              canPrevious={safeIndex > 0}
              canNext={safeIndex < filteredResponses.length - 1}
              reviewPanel={
                <ReviewPanel
                  review={reviews[currentResponse.id] ?? EMPTY_REVIEW}
                  onChange={(update) => updateReview(currentResponse.id, update)}
                  onReviewed={() => {
                    const wasReviewed = reviews[currentResponse.id]?.reviewed ?? false;
                    updateReview(currentResponse.id, { reviewed: !wasReviewed });
                    if (!wasReviewed && settings.autoAdvance) navigate(1);
                  }}
                />
              }
            />
          ) : (
            <div className="grid min-h-full place-items-center text-center">
              <div>
                <Inbox className="mx-auto size-8 text-muted" />
                <p className="mt-4 font-serif text-xl">Nothing to review here</p>
                <p className="mt-1 text-sm text-muted">
                  {query ? "Clear your search to see every response." : "This worksheet has no response rows."}
                </p>
                {query && (
                  <Button className="mt-5" variant="secondary" onClick={() => setQuery("")}>
                    Clear search
                  </Button>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
