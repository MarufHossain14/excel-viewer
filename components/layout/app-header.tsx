"use client";

import { Aperture, ChevronDown, FileSpreadsheet, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { WorkbookData } from "@/types/workbook";

interface AppHeaderProps {
  workbook: WorkbookData;
  selectedSheetId: string;
  onSelectSheet: (id: string) => void;
  onReset: () => void;
}

export function AppHeader({ workbook, selectedSheetId, onSelectSheet, onReset }: AppHeaderProps) {
  const selectedSheet = workbook.sheets.find((sheet) => sheet.id === selectedSheetId);

  return (
    <header className="flex h-[68px] shrink-0 items-center justify-between border-b bg-surface/90 px-4 backdrop-blur-md sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex shrink-0 items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-xl bg-foreground text-background">
            <Aperture className="size-[18px]" aria-hidden="true" />
          </span>
          <span className="hidden text-sm font-bold tracking-tight sm:block">FormLens</span>
        </div>
        <span className="mx-1 hidden h-5 w-px bg-border sm:block" aria-hidden="true" />
        <div className="flex min-w-0 items-center gap-2">
          <FileSpreadsheet className="size-4 shrink-0 text-accent" aria-hidden="true" />
          <div className="min-w-0">
            <p className="max-w-48 truncate text-xs font-semibold sm:max-w-64">{workbook.name}</p>
            <p className="text-[10px] text-muted">Stored on this device</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {workbook.sheets.length > 1 ? (
          <label className="relative hidden sm:block">
            <span className="sr-only">Worksheet</span>
            <select
              className="h-9 appearance-none rounded-xl border bg-surface-raised py-0 pl-3 pr-8 text-xs font-semibold shadow-sm outline-none focus:ring-2 focus:ring-[var(--ring)]"
              value={selectedSheetId}
              onChange={(event) => onSelectSheet(event.target.value)}
            >
              {workbook.sheets.map((sheet) => (
                <option key={sheet.id} value={sheet.id}>
                  {sheet.name} · {sheet.responses.length} rows
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 size-4 text-muted" />
          </label>
        ) : (
          <span className="hidden rounded-lg border bg-surface-raised px-3 py-2 text-xs font-semibold sm:block">
            {selectedSheet?.name} · {selectedSheet?.responses.length ?? 0} rows
          </span>
        )}
        <Button size="icon-sm" variant="ghost" onClick={onReset} aria-label="Open another file">
          <RotateCcw className="size-4" />
        </Button>
      </div>
    </header>
  );
}
