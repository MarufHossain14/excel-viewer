"use client";

import { useCallback, useRef, useState } from "react";
import { FileSpreadsheet, LockKeyhole, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ACCEPTED_EXTENSIONS = ["xlsx", "xls", "csv"];
const MAX_FILE_SIZE = 50 * 1024 * 1024;

interface UploadZoneProps {
  onFile: (file: File) => Promise<void>;
}

export function UploadZone({ onFile }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFile = useCallback(
    async (candidate?: File) => {
      if (!candidate) return;
      const extension = candidate.name.split(".").pop()?.toLowerCase();
      if (!extension || !ACCEPTED_EXTENSIONS.includes(extension)) {
        setError("Choose an Excel workbook or CSV file (.xlsx, .xls, or .csv). ");
        return;
      }
      if (candidate.size > MAX_FILE_SIZE) {
        setError("That file is over 50 MB. Try a smaller workbook.");
        return;
      }

      setFileName(candidate.name);
      setError(null);
      setIsLoading(true);
      try {
        await onFile(candidate);
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "We couldn’t read that file.");
        setFileName(null);
      } finally {
        setIsLoading(false);
      }
    },
    [onFile],
  );

  return (
    <div className="w-full max-w-[640px] animate-rise-in">
      <div
        className={cn(
          "group rounded-xl border border-border bg-surface-raised p-2 shadow-[var(--shadow)] transition-[background-color,border-color] duration-150",
          isDragging && "select-none border-brand bg-accent-soft",
        )}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) setIsDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          void handleFile(event.dataTransfer.files[0]);
        }}
      >
        <div className="flex min-h-[310px] flex-col items-center justify-center rounded-lg border border-dashed border-border-strong px-8 py-12 text-center">
          <div className="mb-6 grid size-14 place-items-center rounded-lg border border-border bg-surface text-foreground">
            {isLoading ? (
              <FileSpreadsheet className="size-7 animate-pulse" aria-hidden="true" />
            ) : (
              <Upload className="size-7" aria-hidden="true" />
            )}
          </div>
          <h2 className="text-pretty text-xl font-semibold leading-7 tracking-[-0.02em]">
            {isDragging ? "Release to open" : "Bring your responses into focus"}
          </h2>
          <p className="mt-2 max-w-sm text-sm leading-6 text-muted">
            Drop an Excel or CSV file here, or choose one from your computer.
          </p>
          <input
            ref={inputRef}
            className="sr-only"
            type="file"
            name="workbook"
            accept=".xlsx,.xls,.csv"
            onChange={(event) => void handleFile(event.target.files?.[0])}
          />
          <Button
            className="mt-7 min-w-36"
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isLoading}
          >
            {isLoading ? (
              <FileSpreadsheet className="size-4 animate-pulse" aria-hidden="true" />
            ) : (
              <Upload className="size-4" aria-hidden="true" />
            )}
            {isLoading ? "Reading file…" : "Choose File"}
          </Button>

          {isLoading && fileName && (
            <p className="mt-5 max-w-sm truncate text-xs font-medium text-muted" aria-live="polite">
              Reading {fileName}
            </p>
          )}

          {error && (
            <p className="mt-5 text-sm font-medium text-danger" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[12px] font-medium text-muted">
        <LockKeyhole className="size-3.5 text-brand" aria-hidden="true" />
        Your file never leaves this device
        <span aria-hidden="true">·</span>
        Up to 50 MB
      </div>
    </div>
  );
}
