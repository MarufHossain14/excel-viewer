import * as XLSX from "xlsx";
import type {
  CellValue,
  FormField,
  FormResponse,
  WorkbookData,
  WorksheetData,
} from "@/types/workbook";

const LONG_ANSWER_LENGTH = 90;

function normalizeCell(value: unknown): CellValue {
  if (value === null || value === undefined || value === "") return null;
  if (value instanceof Date) {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle:
        value.getHours() || value.getMinutes() || value.getSeconds()
          ? "short"
          : undefined,
    }).format(value);
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  return String(value);
}

function makeUniqueHeaders(row: unknown[], columnCount: number) {
  const occurrences = new Map<string, number>();
  const originals: string[] = [];
  const headers: string[] = [];

  for (let index = 0; index < columnCount; index += 1) {
    const raw = normalizeCell(row[index]);
    const original = raw === null ? `Untitled field ${index + 1}` : String(raw).trim();
    const safeOriginal = original || `Untitled field ${index + 1}`;
    const count = (occurrences.get(safeOriginal.toLocaleLowerCase()) ?? 0) + 1;
    occurrences.set(safeOriginal.toLocaleLowerCase(), count);
    originals.push(safeOriginal);
    headers.push(count === 1 ? safeOriginal : `${safeOriginal} (${count})`);
  }

  return { headers, originals };
}

function parseSheet(sheet: XLSX.WorkSheet, name: string, sheetIndex: number): WorksheetData {
  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    raw: false,
    defval: null,
    blankrows: false,
    dateNF: "mmm d, yyyy",
  });

  if (rows.length === 0) {
    return { id: `sheet-${sheetIndex}`, name, headers: [], responses: [] };
  }

  const columnCount = rows.reduce((largest, row) => Math.max(largest, row.length), 0);
  const { headers, originals } = makeUniqueHeaders(rows[0], columnCount);
  const responses: FormResponse[] = rows.slice(1).map((row, rowIndex) => {
    const fields: FormField[] = headers.map((label, columnIndex) => {
      const value = normalizeCell(row[columnIndex]);
      const searchValue = value === null ? "" : String(value);
      return {
        id: `${sheetIndex}-${columnIndex}`,
        label,
        originalLabel: originals[columnIndex],
        value,
        searchValue,
        isLong: searchValue.length > LONG_ANSWER_LENGTH || searchValue.includes("\n"),
      };
    });
    const rowNumber = rowIndex + 2;
    return {
      id: `${sheetIndex}-${rowNumber}`,
      rowNumber,
      fields,
      searchText: fields
        .flatMap((field) => [field.label, field.searchValue])
        .join(" ")
        .toLocaleLowerCase(),
    };
  });

  return { id: `sheet-${sheetIndex}`, name, headers, responses };
}

export async function parseWorkbookFile(file: File): Promise<WorkbookData> {
  try {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, {
      type: "array",
      cellDates: true,
      dense: true,
      WTF: false,
    });

    if (workbook.SheetNames.length === 0) {
      throw new Error("This workbook doesn’t contain any worksheets.");
    }

    const sheets = workbook.SheetNames.map((name, index) =>
      parseSheet(workbook.Sheets[name], name, index),
    );
    if (sheets.every((sheet) => sheet.headers.length === 0)) {
      throw new Error("This workbook is empty. Add a header row and at least one response.");
    }

    return {
      id: `${file.name}-${file.size}-${file.lastModified}`,
      name: file.name,
      size: file.size,
      importedAt: Date.now(),
      sheets,
    };
  } catch (cause) {
    if (cause instanceof Error && cause.message.startsWith("This workbook")) throw cause;
    throw new Error(
      "We couldn’t read this spreadsheet. It may be corrupted, password-protected, or use an unsupported format.",
    );
  }
}
