import type { BulkSlotInput } from "./planning.service";

interface RawRow {
  [key: string]: string | number | undefined;
}

function pick(row: RawRow, keys: string[]): string | undefined {
  for (const key of keys) {
    const match = Object.keys(row).find((k) => k.trim().toLowerCase() === key);
    if (match && row[match] !== undefined && row[match] !== "") {
      return String(row[match]).trim();
    }
  }
  return undefined;
}

function normalizeTime(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const match = value.match(/^(\d{1,2})[:h](\d{2})?/);
  if (!match) return undefined;
  const hours = match[1]!.padStart(2, "0");
  const minutes = (match[2] ?? "00").padStart(2, "0");
  return `${hours}:${minutes}`;
}

function normalizeDate(value: string | number | undefined): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value === "number") {
    // Numéro de série Excel (jours depuis 1899-12-30)
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    const date = new Date(excelEpoch.getTime() + value * 86400000);
    return date.toISOString().slice(0, 10);
  }
  const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) return value.slice(0, 10);
  const frMatch = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (frMatch) {
    const [, day, month, year] = frMatch;
    return `${year}-${month!.padStart(2, "0")}-${day!.padStart(2, "0")}`;
  }
  return undefined;
}

export interface ParsedImportResult {
  valid: BulkSlotInput[];
  errors: { row: number; message: string }[];
}

export async function parsePlanningExcelFile(file: File): Promise<ParsedImportResult> {
  const XLSX = await import("xlsx");
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const firstSheet = workbook.SheetNames[0];
  if (!firstSheet) {
    return { valid: [], errors: [{ row: 0, message: "Le fichier ne contient aucune feuille." }] };
  }

  const rows = XLSX.utils.sheet_to_json<RawRow>(workbook.Sheets[firstSheet]!, { defval: "" });

  const valid: BulkSlotInput[] = [];
  const errors: ParsedImportResult["errors"] = [];

  rows.forEach((row, index) => {
    const rowNumber = index + 2; // +1 en-tête, +1 index 0-based
    const date = normalizeDate(pick(row, ["date"]));
    const start = normalizeTime(pick(row, ["début", "debut", "heure début", "heure debut", "heure de début"]));
    const end = normalizeTime(pick(row, ["fin", "heure fin", "heure de fin"]));
    const conducteur = pick(row, ["conducteur", "conducteur de prière", "conducteur de priere"]);
    const location = pick(row, ["lieu", "location"]);
    const notes = pick(row, ["notes", "remarques"]);

    if (!date) {
      errors.push({ row: rowNumber, message: "Date manquante ou invalide." });
      return;
    }
    if (!start || !end) {
      errors.push({ row: rowNumber, message: "Heure de début ou de fin manquante ou invalide." });
      return;
    }

    valid.push({
      slot_date: date,
      start_time: start,
      end_time: end,
      conducteur_full_name: conducteur,
      location,
      notes,
    });
  });

  return { valid, errors };
}
