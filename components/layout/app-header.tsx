"use client";

import { ChevronDown, FileSpreadsheet, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { WorkbookData } from "@/types/workbook";
import type { ReactNode } from "react";

interface AppHeaderProps {
  workbook: WorkbookData;
  selectedSheetId: string;
  reviewedCount: number;
  totalCount: number;
  onSelectSheet: (id: string) => void;
  onReset: () => void;
  children?: ReactNode;
}

export function AppHeader({
  workbook,
  selectedSheetId,
  reviewedCount,
  totalCount,
  onSelectSheet,
  onReset,
  children,
}: AppHeaderProps) {
  const selectedSheet = workbook.sheets.find((sheet) => sheet.id === selectedSheetId);

  return (
    <header className="flex h-14 shrink-0 items-center border-b bg-surface-raised px-3 sm:px-4 lg:px-5">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
          <FileSpreadsheet className="size-4" aria-hidden="true" />
        </span>
        <span className="hidden text-sm font-semibold sm:block" translate="no">FormLens</span>
        <span className="hidden h-5 w-px bg-border sm:block" aria-hidden="true" />
        <div className="min-w-0">
          <p className="max-w-20 truncate text-[13px] font-medium sm:max-w-52 lg:max-w-72">{workbook.name}</p>
          <p className="text-[10px] text-muted sm:hidden">{reviewedCount}/{totalCount} finished</p>
        </div>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-1">
        {workbook.sheets.length > 1 ? (
          <label className="relative w-16 sm:w-36 lg:w-44">
            <span className="sr-only">Worksheet</span>
            <select
              name="worksheet"
              className="h-8 w-full appearance-none truncate rounded-lg border bg-surface-raised py-0 pl-2.5 pr-6 text-xs font-medium text-foreground focus-visible:border-ring"
              value={selectedSheetId}
              onChange={(event) => onSelectSheet(event.target.value)}
            >
              {workbook.sheets.map((sheet) => (
                <option key={sheet.id} value={sheet.id}>{sheet.name} · {sheet.responses.length}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-1.5 top-2 size-3.5 text-muted" aria-hidden="true" />
          </label>
        ) : (
          <span className="hidden max-w-32 truncate text-xs text-muted md:block">{selectedSheet?.name}</span>
        )}

        <div className="mx-1 hidden items-center gap-2 border-x px-3 text-xs sm:flex">
          <span className="tabular-nums text-muted">{reviewedCount}/{totalCount}</span>
          <span className="hidden text-muted lg:inline">finished</span>
        </div>

        {children}

        <Dialog>
          <DialogTrigger asChild>
            <Button size="icon-sm" variant="ghost" aria-label="Open a different file" title="Open a different file">
              <FolderOpen className="size-4" aria-hidden="true" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Open a different file?</DialogTitle>
              <DialogDescription>
                This removes the current file and its notes from this browser. Download a copy first if you need them.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <DialogTrigger asChild><Button variant="secondary">Cancel</Button></DialogTrigger>
              <Button variant="danger" onClick={onReset}>Open another file</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
