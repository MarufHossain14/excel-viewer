"use client";

import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { AppSettings, FontSize, Theme } from "@/types/workbook";

export function SettingsDialog({ settings, onChange }: { settings: AppSettings; onChange: (update: Partial<AppSettings>) => void }) {
  const toggles: Array<[string, string, keyof Pick<AppSettings, "compactMode" | "hideEmptyAnswers" | "autoAdvance">]> = [
    ["Compact layout", "Fit more answers on screen", "compactMode"],
    ["Hide empty answers", "Remove unanswered fields from view", "hideEmptyAnswers"],
    ["Auto advance", "Move forward after marking reviewed", "autoAdvance"],
  ];
  return (
    <Dialog>
      <DialogTrigger asChild><Button size="icon-sm" variant="ghost" aria-label="Open settings"><Settings className="size-4" /></Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Workspace Settings</DialogTitle><DialogDescription>Make FormLens comfortable for long review sessions.</DialogDescription></DialogHeader>
        <fieldset><legend className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Appearance</legend>
          <div className="mt-3 grid grid-cols-3 gap-2">{(["light", "dark", "system"] as Theme[]).map((theme) => <button type="button" key={theme} className={cn("rounded-xl border px-3 py-2 text-xs font-semibold capitalize transition-colors hover:bg-accent-soft", settings.theme === theme && "border-accent bg-accent-soft text-accent")} onClick={() => onChange({ theme })}>{theme}</button>)}</div>
        </fieldset>
        <fieldset className="mt-6"><legend className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Text size</legend>
          <div className="mt-3 grid grid-cols-3 gap-2">{(["small", "medium", "large"] as FontSize[]).map((size) => <button type="button" key={size} className={cn("rounded-xl border px-3 py-2 text-xs font-semibold capitalize transition-colors hover:bg-accent-soft", settings.fontSize === size && "border-accent bg-accent-soft text-accent")} onClick={() => onChange({ fontSize: size })}>{size}</button>)}</div>
        </fieldset>
        <div className="mt-6 divide-y rounded-2xl border px-4">{toggles.map(([label, description, key]) => <label key={key} className="flex items-center justify-between gap-4 py-4"><span><span className="block text-sm font-semibold">{label}</span><span className="mt-0.5 block text-xs text-muted">{description}</span></span><Switch checked={settings[key]} onCheckedChange={(checked) => onChange({ [key]: checked })} aria-label={label} /></label>)}</div>
      </DialogContent>
    </Dialog>
  );
}
