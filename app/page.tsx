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
      <main className="grid min-h-screen place-items-center" aria-label="Loading workspace">
        <Aperture className="size-7 animate-pulse text-accent" aria-hidden="true" />
      </main>
    );
  }

  if (workbook) {
    return <Workspace />;
  }

  return (
    <main className="relative grid min-h-screen grid-rows-[auto_1fr_auto] overflow-hidden px-6 py-5 sm:px-10 sm:py-7">
      <div className="pointer-events-none absolute inset-0 opacity-55 [background-image:radial-gradient(circle_at_20%_10%,color-mix(in_srgb,var(--accent)_10%,transparent),transparent_26%),linear-gradient(to_right,color-mix(in_srgb,var(--border)_38%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_srgb,var(--border)_38%,transparent)_1px,transparent_1px)] [background-size:auto,32px_32px,32px_32px]" />
      <header className="relative flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-xl bg-foreground text-background shadow-sm">
            <Aperture className="size-[18px]" aria-hidden="true" />
          </span>
          <span className="text-sm font-bold tracking-tight">FormLens</span>
        </div>
        <div className="rounded-full border border-border bg-surface/75 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-muted backdrop-blur">
          LOCAL WORKSPACE
        </div>
      </header>

      <section className="relative flex flex-col items-center justify-center py-16">
        <div className="mb-9 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent">
            One response at a time
          </p>
          <h1 className="mx-auto max-w-xl font-serif text-4xl font-medium leading-[1.08] tracking-[-0.035em] sm:text-5xl">
            Your spreadsheet,
            <br /> finally readable.
          </h1>
        </div>
        <UploadZone onFile={handleFile} />
      </section>

      <footer className="relative text-center text-[11px] text-muted">
        Private by design · Stored locally in your browser
      </footer>
    </main>
  );
}
