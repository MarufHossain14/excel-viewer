import { openDB, type DBSchema, type IDBPDatabase } from "idb";
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

let database: Promise<IDBPDatabase<FormLensDatabase>> | undefined;

function getDatabase() {
  database ??= openDB<FormLensDatabase>("formlens", 1, {
    upgrade(db) {
      db.createObjectStore("state");
    },
  });
  return database;
}

export async function loadAppState() {
  return (await getDatabase()).get("state", "current");
}

export async function saveAppState(state: PersistedAppState) {
  await (await getDatabase()).put("state", state, "current");
}
