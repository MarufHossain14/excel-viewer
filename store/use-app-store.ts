import { create } from "zustand";
import { loadAppState, saveAppState } from "@/lib/db";
import { parseSettings } from "@/lib/settings";
import type { AppSettings, ReviewState, WorkbookData } from "@/types/workbook";

const DEFAULT_SETTINGS: AppSettings = {
  theme: "system",
  compactMode: false,
  fontSize: "medium",
  hideEmptyAnswers: true,
  autoAdvance: false,
};

interface AppStore {
  hydrated: boolean;
  workbook: WorkbookData | null;
  selectedSheetId: string | null;
  currentResponseId: string | null;
  reviews: Record<string, ReviewState>;
  settings: AppSettings;
  hydrate: () => Promise<void>;
  setWorkbook: (workbook: WorkbookData) => void;
  clearWorkbook: () => Promise<void>;
  selectSheet: (sheetId: string) => void;
  selectResponse: (responseId: string) => void;
  updateReview: (responseId: string, update: Partial<ReviewState>) => void;
  updateSettings: (update: Partial<AppSettings>) => void;
}

let persistenceTimer: ReturnType<typeof setTimeout> | undefined;

function persist(state: AppStore, immediate = false) {
  const snapshot = {
    workbook: state.workbook,
    selectedSheetId: state.selectedSheetId,
    currentResponseId: state.currentResponseId,
    reviews: state.reviews,
    settings: state.settings,
  };
  if (persistenceTimer) clearTimeout(persistenceTimer);
  if (immediate) void saveAppState(snapshot);
  else persistenceTimer = setTimeout(() => void saveAppState(snapshot), 180);
}

export const useAppStore = create<AppStore>((set, get) => ({
  hydrated: false,
  workbook: null,
  selectedSheetId: null,
  currentResponseId: null,
  reviews: {},
  settings: DEFAULT_SETTINGS,
  hydrate: async () => {
    try {
      const saved = await loadAppState();
      if (saved) {
        set({ ...saved, settings: parseSettings(saved.settings, DEFAULT_SETTINGS), hydrated: true });
      }
      else set({ hydrated: true });
    } catch {
      set({ hydrated: true });
    }
  },
  setWorkbook: (workbook) => {
    const firstSheet = workbook.sheets[0];
    set({
      workbook,
      selectedSheetId: firstSheet?.id ?? null,
      currentResponseId: firstSheet?.responses[0]?.id ?? null,
      reviews: {},
    });
    persist(get(), true);
  },
  clearWorkbook: async () => {
    set({ workbook: null, selectedSheetId: null, currentResponseId: null, reviews: {} });
    persist(get(), true);
  },
  selectSheet: (selectedSheetId) => {
    const sheet = get().workbook?.sheets.find((candidate) => candidate.id === selectedSheetId);
    set({ selectedSheetId, currentResponseId: sheet?.responses[0]?.id ?? null });
    persist(get());
  },
  selectResponse: (currentResponseId) => {
    set({ currentResponseId });
    persist(get());
  },
  updateReview: (responseId, update) => {
    const current = get().reviews[responseId] ?? {
      reviewed: false,
      starred: false,
      rating: 0,
      notes: "",
      updatedAt: 0,
    };
    set({
      reviews: {
        ...get().reviews,
        [responseId]: { ...current, ...update, updatedAt: Date.now() },
      },
    });
    persist(get());
  },
  updateSettings: (update) => {
    set({ settings: { ...get().settings, ...update } });
    persist(get());
  },
}));
