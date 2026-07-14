"use client";

import { Aperture, ChevronDown, FileSpreadsheet, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { WorkbookData } from "@/types/workbook";
import type { ReactNode } from "react";

interface AppHeaderProps {
  workbook: WorkbookData;
  selectedSheetId: string;
  onSelectSheet: (id: string) => void;
  onReset: () => void;
  children?: ReactNode;
}

export function AppHeader({ workbook, selectedSheetId, onSelectSheet, onReset, children }: AppHeaderProps) {
  const selectedSheet = workbook.sheets.find((sheet) => sheet.id === selectedSheetId);

  return (
    <header className="flex h-[72px] shrink-0 items-center justify-between border-b bg-surface/88 px-4 shadow-[0_1px_0_rgb(255_255_255/0.4)] backdrop-blur-xl sm:px-5 dark:shadow-none">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex shrink-0 items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-foreground text-background shadow-sm">
            <Aperture className="size-[18px]" aria-hidden="true" />
          </span>
          <span className="hidden text-[15px] font-extrabold tracking-[-0.03em] sm:block">FormLens</span>
        </div>
        <span className="mx-1 hidden h-5 w-px bg-border sm:block" aria-hidden="true" />
        <div className="flex min-w-0 items-center gap-2">
          <FileSpreadsheet className="size-4 shrink-0 text-accent" aria-hidden="true" />
          <div className="min-w-0">
            <p className="max-w-48 truncate text-[13px] font-bold tracking-[-0.01em] sm:max-w-64">{workbook.name}</p>
            <p className="mt-0.5 text-[11px] text-muted">Private · Stored on this device</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {workbook.sheets.length > 1 ? (
          <label className="relative hidden sm:block">
            <span className="sr-only">Worksheet</span>
            <select
              name="worksheet"
              className="h-10 appearance-none rounded-xl border bg-surface-raised py-0 pl-3 pr-8 text-[12px] font-bold shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
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
          <span className="hidden rounded-xl border bg-surface-raised px-3 py-2.5 text-[12px] font-bold shadow-sm sm:block">
            {selectedSheet?.name} · {selectedSheet?.responses.length ?? 0} rows
          </span>
        )}
        <span className="mx-0.5 h-5 w-px bg-border" aria-hidden="true" />
        {children}
        <Dialog>
          <DialogTrigger asChild>
            <Button size="icon-sm" variant="ghost" aria-label="Open another file">
              <RotateCcw className="size-4" aria-hidden="true" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Open Another File?</DialogTitle>
              <DialogDescription>
                The current workbook and its review data will be removed from this browser. Export your notes first if you need them.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2">
              <DialogTrigger asChild><Button variant="secondary">Keep Workbook</Button></DialogTrigger>
              <Button variant="danger" onClick={onReset}>Remove & Open Another</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
