import { z } from "zod";
import type { AppSettings } from "@/types/workbook";

export const settingsSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  compactMode: z.boolean(),
  fontSize: z.enum(["small", "medium", "large"]),
  hideEmptyAnswers: z.boolean(),
  autoAdvance: z.boolean(),
});

export function parseSettings(value: unknown, fallback: AppSettings) {
  const result = settingsSchema.safeParse(value);
  return result.success ? result.data : fallback;
}
