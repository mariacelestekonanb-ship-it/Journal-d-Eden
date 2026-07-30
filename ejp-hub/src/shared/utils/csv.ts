/**
 * Parseur CSV minimal (RFC 4180) : champs entre guillemets, guillemets
 * échappés (`""`), retours à la ligne à l'intérieur d'un champ. Suffisant
 * pour les imports de fichiers préparés dans un tableur (Excel, Google
 * Sheets) — pas de dépendance externe pour un besoin aussi ciblé.
 */
export function parseCsv(text: string): string[][] {
  const content = text.replace(/^﻿/, ""); // BOM éventuel (ajouté par nos propres exports)
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  let i = 0;

  while (i < content.length) {
    const char = content[i];

    if (inQuotes) {
      if (char === '"') {
        if (content[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      field += char;
      i += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      i += 1;
      continue;
    }
    if (char === ",") {
      row.push(field);
      field = "";
      i += 1;
      continue;
    }
    if (char === "\r") {
      i += 1;
      continue;
    }
    if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      i += 1;
      continue;
    }
    field += char;
    i += 1;
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((cells) => !(cells.length === 1 && cells[0] === ""));
}

function toCsvValue(value: string): string {
  const escaped = value.replace(/"/g, '""');
  return /[",\n]/.test(value) ? `"${escaped}"` : escaped;
}

/** Génère un CSV (avec BOM UTF-8) à partir d'un en-tête et de lignes de cellules. */
export function toCsvContent(header: string[], rows: string[][]): string {
  return [header, ...rows].map((cells) => cells.map(toCsvValue).join(",")).join("\n");
}

/** Déclenche le téléchargement d'un fichier CSV (BOM UTF-8 pour un bon rendu des accents dans Excel). */
export function downloadCsv(header: string[], rows: string[][], fileName: string): void {
  const csv = toCsvContent(header, rows);
  const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
