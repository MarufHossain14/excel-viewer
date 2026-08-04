"use client";

import { useCallback, useRef, useState } from "react";
import { FileSpreadsheet, Upload } from "lucide-react";
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
        setError("Choose an Excel or CSV file (.xlsx, .xls, or .csv).");
        return;
      }
      if (candidate.size > MAX_FILE_SIZE) {
        setError("That file is over 50\u00a0MB. Choose a smaller file.");
        return;
      }

      setFileName(candidate.name);
      setError(null);
      setIsLoading(true);
      try {
        await onFile(candidate);
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "We couldn’t open that file.");
        setFileName(null);
      } finally {
        setIsLoading(false);
      }
    },
    [onFile],
  );

  return (
    <div className="w-full">
      <div
        className={cn(
          "rounded-xl border border-border-strong bg-surface-raised px-6 py-10 text-center shadow-[var(--shadow-soft)] transition-colors sm:px-10 sm:py-12",
          isDragging && "border-accent bg-accent-soft",
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
        <FileSpreadsheet className="mx-auto size-7 text-muted" aria-hidden="true" />
        <h2 className="mt-4 text-balance text-lg font-semibold">
          {isDragging ? "Drop the File Here" : "Open a Spreadsheet"}
        </h2>
        <p className="mt-1 text-sm text-muted">Excel or CSV, up to 50&nbsp;MB</p>
        <input
          ref={inputRef}
          className="sr-only"
          type="file"
          name="workbook"
          accept=".xlsx,.xls,.csv"
          onChange={(event) => void handleFile(event.target.files?.[0])}
        />
        <Button
          className="mt-5 min-w-40"
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isLoading}
        >
          {isLoading ? <FileSpreadsheet className="size-4 animate-pulse" aria-hidden="true" /> : <Upload className="size-4" aria-hidden="true" />}
          {isLoading ? "Opening…" : "Choose File"}
        </Button>

        {isLoading && fileName && (
          <p className="mt-3 truncate text-xs text-muted" aria-live="polite">{fileName}</p>
        )}
        {error && <p className="mt-4 text-sm font-medium text-danger" role="alert">{error}</p>}
      </div>
      <p className="mt-3 text-xs text-muted">Your file is processed only in this browser.</p>
    </div>
  );
}
