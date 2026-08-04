"use client";

import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { AppSettings, FontSize, Theme } from "@/types/workbook";

interface SettingsDialogProps {
  settings: AppSettings;
  onChange: (update: Partial<AppSettings>) => void;
}

const TOGGLES: Array<[
  string,
  string,
  keyof Pick<AppSettings, "compactMode" | "hideEmptyAnswers" | "autoAdvance">,
]> = [
  ["Compact Layout", "Fit more answers on screen", "compactMode"],
  ["Hide Empty Answers", "Remove unanswered fields from view", "hideEmptyAnswers"],
  ["Move Forward Automatically", "After you mark a response finished", "autoAdvance"],
];

const optionClassName =
  "min-h-10 rounded-lg border bg-surface-raised px-3 py-2 text-[13px] font-medium capitalize transition-colors hover:bg-accent-soft";

export function SettingsDialog({ settings, onChange }: SettingsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon-sm" variant="ghost" aria-label="Open preferences" title="Preferences">
          <Settings className="size-4" aria-hidden="true" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Preferences</DialogTitle>
          <DialogDescription>Adjust the reading view and review behavior.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 sm:grid-cols-2">
          <fieldset>
            <legend className="text-xs font-medium text-muted">Appearance</legend>
            <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-1">
              {(["light", "dark", "system"] as Theme[]).map((theme) => (
                <button
                  type="button"
                  key={theme}
                  className={cn(
                    optionClassName,
                    settings.theme === theme && "border-accent bg-accent-soft text-accent",
                  )}
                  onClick={() => onChange({ theme })}
                  aria-pressed={settings.theme === theme}
                >
                  {theme}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-xs font-medium text-muted">Answer Size</legend>
            <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-1">
              {(["small", "medium", "large"] as FontSize[]).map((size) => (
                <button
                  type="button"
                  key={size}
                  className={cn(
                    optionClassName,
                    settings.fontSize === size && "border-accent bg-accent-soft text-accent",
                  )}
                  onClick={() => onChange({ fontSize: size })}
                  aria-pressed={settings.fontSize === size}
                >
                  {size}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="mt-5 divide-y rounded-lg border px-4">
          {TOGGLES.map(([label, description, key]) => (
            <label key={key} className="flex min-h-16 items-center justify-between gap-4 py-3">
              <span className="min-w-0">
                <span className="block text-sm font-medium">{label}</span>
                <span className="mt-0.5 block text-xs leading-5 text-muted">{description}</span>
              </span>
              <Switch
                checked={settings[key]}
                onCheckedChange={(checked) => onChange({ [key]: checked })}
                aria-label={label}
              />
            </label>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
