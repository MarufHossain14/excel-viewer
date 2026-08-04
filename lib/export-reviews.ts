import * as XLSX from "xlsx";
import type { ReviewState, WorkbookData } from "@/types/workbook";

export function exportReviews(workbook: WorkbookData, reviews: Record<string, ReviewState>) {
  const exportedWorkbook = XLSX.utils.book_new();
  const usedSheetNames = new Set<string>();

  workbook.sheets.forEach((sheet, sheetIndex) => {
    const rows = sheet.responses.map((response) => {
      const review = reviews[response.id];
      const answers = Object.fromEntries(
        response.fields.map((field) => [field.label, field.value ?? ""]),
      );

      return {
        ...answers,
        "FormLens: Finished": review?.reviewed ? "Yes" : "No",
        "FormLens: Favorite": review?.starred ? "Yes" : "No",
        "FormLens: Rating": review?.rating || "",
        "FormLens: Note": review?.notes ?? "",
      };
    });

    const worksheet = rows.length
      ? XLSX.utils.json_to_sheet(rows)
      : XLSX.utils.aoa_to_sheet([[
          ...sheet.headers,
          "FormLens: Finished",
          "FormLens: Favorite",
          "FormLens: Rating",
          "FormLens: Note",
        ]]);

    const fallbackName = `Sheet ${sheetIndex + 1}`;
    const cleanedName = (sheet.name || fallbackName).replace(/[\\/?*:[\]]/g, " ").trim();
    let safeName = cleanedName.slice(0, 31) || fallbackName;
    let duplicateIndex = 2;
    while (usedSheetNames.has(safeName.toLocaleLowerCase())) {
      const suffix = ` ${duplicateIndex}`;
      safeName = `${cleanedName.slice(0, 31 - suffix.length)}${suffix}`;
      duplicateIndex += 1;
    }
    usedSheetNames.add(safeName.toLocaleLowerCase());
    XLSX.utils.book_append_sheet(exportedWorkbook, worksheet, safeName);
  });

  const baseName = workbook.name.replace(/\.[^.]+$/, "");
  XLSX.writeFile(exportedWorkbook, `${baseName}-with-formlens-notes.xlsx`);
}
