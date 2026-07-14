import { openDB, type DBSchema } from "idb";
import type { AppSettings, ReviewState, WorkbookData } from "@/types/workbook";

export interface PersistedAppState {
  workbook: WorkbookData | null;
  selectedSheetId: string | null;
  currentResponseId: string | null;
  reviews: Record<string, ReviewState>;
  settings: AppSettings;
}

interface FormLensDatabase extends DBSchema {
  state: {
    key: "current";
    value: PersistedAppState;
  };
}

const database = openDB<FormLensDatabase>("formlens", 1, {
  upgrade(db) {
    db.createObjectStore("state");
  },
});

export async function loadAppState() {
  return (await database).get("state", "current");
}

export async function saveAppState(state: PersistedAppState) {
  await (await database).put("state", state, "current");
}

export async function clearAppState() {
  await (await database).delete("state", "current");
}
