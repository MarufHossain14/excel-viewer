"use client";

import { useCallback, useRef, useState } from "react";
import { FileSpreadsheet, LockKeyhole, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn, formatFileSize } from "@/lib/utils";

const ACCEPTED_EXTENSIONS = ["xlsx", "xls", "csv"];
const MAX_FILE_SIZE = 50 * 1024 * 1024;

interface UploadZoneProps {
  onFile: (file: File) => Promise<void>;
}

export function UploadZone({ onFile }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
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

      setFile(candidate);
      setError(null);
      setProgress(12);
      setIsLoading(true);
      const timer = window.setInterval(
        () => setProgress((current) => Math.min(current + 9, 88)),
        120,
      );
      try {
        await onFile(candidate);
        setProgress(100);
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "We couldn’t read that file.");
        setFile(null);
        setProgress(0);
      } finally {
        window.clearInterval(timer);
        setIsLoading(false);
      }
    },
    [onFile],
  );

  return (
    <div className="w-full max-w-2xl animate-rise-in">
      <div
        className={cn(
          "group relative overflow-hidden rounded-[28px] border border-border-strong bg-surface-raised p-3 shadow-[var(--shadow)] transition-[transform,background-color,border-color] duration-300",
          isDragging && "select-none scale-[1.01] border-accent bg-accent-soft",
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
        <div className="pointer-events-none absolute -right-14 -top-20 size-52 rounded-full bg-accent/8 blur-2xl" />
        <div className="flex min-h-80 flex-col items-center justify-center rounded-[22px] border border-dashed border-border-strong px-8 py-12 text-center">
          <div className="mb-7 grid size-16 place-items-center rounded-2xl border border-border bg-accent-soft text-accent shadow-sm transition-transform duration-300 group-hover:-rotate-2 group-hover:scale-105">
            {isLoading ? (
              <FileSpreadsheet className="size-7 animate-pulse" aria-hidden="true" />
            ) : (
              <Upload className="size-7" aria-hidden="true" />
            )}
          </div>
          <h2 className="font-serif text-2xl font-medium tracking-tight">
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
            <Upload className="size-4" aria-hidden="true" />
            Choose File
          </Button>

          {file && (
            <div className="mt-7 w-full max-w-sm rounded-xl border border-border bg-background/60 p-3 text-left">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="size-5 text-accent" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{file.name}</p>
                  <p className="text-xs text-muted">{formatFileSize(file.size)}</p>
                </div>
                {!isLoading && (
                  <button
                    type="button"
                    className="rounded-md p-1 text-muted hover:bg-border"
                    onClick={() => setFile(null)}
                    aria-label="Remove selected file"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
              <Progress className="mt-3" value={progress} />
              <p className="mt-2 text-xs text-muted" aria-live="polite">
                {progress === 100 ? "Ready" : "Reading workbook…"}
              </p>
            </div>
          )}

          {error && (
            <p className="mt-5 text-sm font-medium text-danger" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>
      <div className="mt-5 flex items-center justify-center gap-2 text-xs text-muted">
        <LockKeyhole className="size-3.5 text-accent" aria-hidden="true" />
        Your file never leaves this device
        <span aria-hidden="true">·</span>
        Up to 50 MB
      </div>
    </div>
  );
}
