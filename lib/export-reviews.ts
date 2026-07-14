import type { ReviewState, WorkbookData } from "@/types/workbook";

export function exportReviews(workbook: WorkbookData, reviews: Record<string, ReviewState>) {
  const payload = {
    application: "FormLens",
    workbook: workbook.name,
    exportedAt: new Date().toISOString(),
    sheets: workbook.sheets.map((sheet) => ({
      name: sheet.name,
      responses: sheet.responses
        .filter((response) => reviews[response.id])
        .map((response) => ({ row: response.rowNumber, responseId: response.id, ...reviews[response.id] })),
    })),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${workbook.name.replace(/\.[^.]+$/, "")}-formlens-reviews.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}
