"use client";

import { useCallback } from "react";
import { FileSpreadsheet, LockKeyhole } from "lucide-react";
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
      <main id="main-content" className="grid min-h-screen place-items-center" aria-label="Loading FormLens">
        <FileSpreadsheet className="size-6 animate-pulse text-muted" aria-hidden="true" />
      </main>
    );
  }

  if (workbook) return <Workspace />;

  return (
    <main id="main-content" className="min-h-svh bg-background">
      <header className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-accent text-accent-foreground">
            <FileSpreadsheet className="size-4" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold">FormLens</span>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-muted">
          <LockKeyhole className="size-3.5" aria-hidden="true" />
          Your file stays private
        </span>
      </header>

      <section className="mx-auto flex max-w-2xl flex-col items-center px-5 pb-16 pt-[12vh] text-center sm:px-6">
        <h1 className="text-balance text-4xl font-semibold leading-tight tracking-[-0.035em] sm:text-5xl">
          Read spreadsheet responses without the clutter.
        </h1>
        <p className="mt-4 max-w-lg text-base leading-7 text-muted">
          Choose an Excel or CSV file. FormLens shows one response at a time and saves your progress on this device.
        </p>
        <div className="mt-8 w-full">
          <UploadZone onFile={handleFile} />
        </div>
      </section>
    </main>
  );
}
