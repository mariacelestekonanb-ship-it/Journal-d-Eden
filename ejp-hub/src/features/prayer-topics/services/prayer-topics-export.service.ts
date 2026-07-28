import { formatDate } from "@/lib/format";

import type { PrayerTopic } from "../types/prayer-topic.types";

export async function exportPrayerTopicsToExcel(topics: PrayerTopic[], fileName: string): Promise<void> {
  const XLSX = await import("xlsx");

  const rows = topics.map((topic) => ({
    Titre: topic.title,
    Description: topic.description ?? "",
    Priorité: topic.priority,
    Début: formatDate(topic.start_date, "dd/MM/yyyy"),
    Fin: topic.end_date ? formatDate(topic.end_date, "dd/MM/yyyy") : "",
    Statut: topic.status === "actif" ? "Actif" : "Archivé",
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  worksheet["!cols"] = [{ wch: 28 }, { wch: 40 }, { wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 10 }];
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sujets de prière");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}
