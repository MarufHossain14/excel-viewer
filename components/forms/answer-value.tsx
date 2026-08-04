"use client";

import { Check, Copy, ExternalLink, Mail, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { SearchHighlight } from "@/components/forms/search-highlight";
import { Button } from "@/components/ui/button";
import type { FormField } from "@/types/workbook";

type CopyStatus = "idle" | "copied" | "failed";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_PATTERN = /^(?:https?:\/\/|www\.)[^\s]+$/i;
const PHONE_LABEL_PATTERN = /\b(?:phone|mobile|telephone|cell|whatsapp)\b/i;
const PHONE_VALUE_PATTERN = /^\+?[\d\s().-]{7,}$/;

function getAnswerAction(field: FormField, displayValue: string) {
  const trimmedValue = displayValue.trim();

  if (EMAIL_PATTERN.test(trimmedValue)) {
    return {
      href: `mailto:${trimmedValue}`,
      label: "Send email",
      icon: Mail,
      external: false,
    };
  }

  if (URL_PATTERN.test(trimmedValue)) {
    return {
      href: trimmedValue.startsWith("www.") ? `https://${trimmedValue}` : trimmedValue,
      label: "Open link",
      icon: ExternalLink,
      external: true,
    };
  }

  if (
    PHONE_LABEL_PATTERN.test(field.originalLabel) &&
    PHONE_VALUE_PATTERN.test(trimmedValue)
  ) {
    return {
      href: `tel:${trimmedValue.replace(/[^\d+]/g, "")}`,
      label: "Call number",
      icon: Phone,
      external: false,
    };
  }

  return null;
}

export function AnswerValue({ field, query }: { field: FormField; query: string }) {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  useEffect(() => {
    if (copyStatus === "idle") return;
    const resetTimer = window.setTimeout(() => setCopyStatus("idle"), 1800);
    return () => window.clearTimeout(resetTimer);
  }, [copyStatus]);

  if (field.value === null) {
    return <span className="italic text-muted-foreground">No answer</span>;
  }

  const displayValue =
    typeof field.value === "boolean"
      ? field.value
        ? "Yes"
        : "No"
      : String(field.value);
  const action = getAnswerAction(field, displayValue);
  const ActionIcon = action?.icon;

  async function copyAnswer() {
    try {
      await navigator.clipboard.writeText(displayValue);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }
  }

  return (
    <div className="group/answer flex min-w-0 items-start gap-2">
      <div className="min-w-0 flex-1">
        {typeof field.value === "boolean" ? (
          <span className="inline-flex rounded-full border bg-surface px-2.5 py-0.5 text-sm font-medium">
            {displayValue}
          </span>
        ) : action && ActionIcon ? (
          <a
            href={action.href}
            target={action.external ? "_blank" : undefined}
            rel={action.external ? "noreferrer" : undefined}
            className="inline-flex max-w-full items-baseline gap-1.5 rounded-sm font-medium text-foreground underline decoration-border-strong underline-offset-4 transition-colors hover:decoration-foreground"
            aria-label={`${action.label}: ${displayValue}`}
          >
            <span className="min-w-0 break-all">
              <SearchHighlight text={displayValue} query={query} />
            </span>
            <ActionIcon className="size-3.5 shrink-0" aria-hidden="true" />
          </a>
        ) : (
          <SearchHighlight text={displayValue} query={query} />
        )}
      </div>

      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="-mr-2 h-7 shrink-0 px-2 text-[11px] text-muted"
        onClick={copyAnswer}
        aria-label={`Copy ${field.label} answer`}
      >
        {copyStatus === "copied" ? (
          <Check className="size-3.5" aria-hidden="true" />
        ) : (
          <Copy className="size-3.5" aria-hidden="true" />
        )}
        {copyStatus === "copied" ? "Copied" : copyStatus === "failed" ? "Try again" : "Copy"}
      </Button>
      <span className="sr-only" aria-live="polite">
        {copyStatus === "copied"
          ? `${field.label} copied`
          : copyStatus === "failed"
            ? `Could not copy ${field.label}`
            : ""}
      </span>
    </div>
  );
}
