export type CellValue = string | number | boolean | null;

export interface FormField {
  id: string;
  label: string;
  originalLabel: string;
  value: CellValue;
  searchValue: string;
  isLong: boolean;
}

export interface FormResponse {
  id: string;
  rowNumber: number;
  fields: FormField[];
  searchText: string;
}

export interface WorksheetData {
  id: string;
  name: string;
  headers: string[];
  responses: FormResponse[];
}

export interface WorkbookData {
  id: string;
  name: string;
  size: number;
  importedAt: number;
  sheets: WorksheetData[];
}

export interface ReviewState {
  reviewed: boolean;
  starred: boolean;
  rating: number;
  notes: string;
  updatedAt: number;
}

export type Theme = "light" | "dark" | "system";
export type FontSize = "small" | "medium" | "large";

export interface AppSettings {
  theme: Theme;
  compactMode: boolean;
  fontSize: FontSize;
  hideEmptyAnswers: boolean;
  autoAdvance: boolean;
}
