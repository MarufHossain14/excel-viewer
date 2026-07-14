"use client";

import { useCallback } from "react";
import { Aperture } from "lucide-react";
import { UploadZone } from "@/components/forms/upload-zone";
import { Workspace } from "@/components/layout/workspace";
import { useHydrateStore } from "@/hooks/use-hydrate-store";
import { useAppearance } from "@/hooks/use-appearance";
import { parseWorkbookFile } from "@/lib/parser";
import { useAppStore } from "@/store/use-app-store";

export default function Home() {
  const hydrated = useHydrateStore();
  useAppearance();
  const workbook = useAppStore((state) => state.workbook);
  const setWorkbook = useAppStore((state) => state.setWorkbook);
  const handleFile = useCallback(
    async (file: File) => setWorkbook(await parseWorkbookFile(file)),
    [setWorkbook],
  );

  if (!hydrated) {
    return (
      <main id="main-content" className="grid min-h-screen place-items-center" aria-label="Loading workspace">
        <Aperture className="size-7 animate-pulse text-accent" aria-hidden="true" />
      </main>
    );
  }

  if (workbook) {
    return <Workspace />;
  }

  return (
    <main id="main-content" className="grid min-h-screen grid-rows-[auto_1fr_auto] overflow-hidden bg-background px-6 py-5 sm:px-10 sm:py-7">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-foreground text-background">
            <Aperture className="size-[18px]" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold tracking-[-0.02em]">FormLens</span>
        </div>
        <div className="rounded-md border border-border bg-surface-raised px-2.5 py-1.5 text-xs font-medium text-muted">
          LOCAL WORKSPACE
        </div>
      </header>

      <section className="flex flex-col items-center justify-center py-14">
        <div className="mb-8 text-center">
          <p className="mb-3 text-sm font-medium text-brand">
            One response at a time
          </p>
          <h1 className="mx-auto max-w-2xl text-pretty text-4xl font-semibold leading-[1.1] tracking-[-0.04em] sm:text-5xl">
            Your spreadsheet,
            <br /> finally readable.
          </h1>
        </div>
        <UploadZone onFile={handleFile} />
      </section>

      <footer className="text-center text-xs text-muted">
        Private by design · Stored locally in your browser
      </footer>
    </main>
  );
}
