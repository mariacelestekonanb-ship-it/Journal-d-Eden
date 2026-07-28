import { PRAYER_TOPIC_CATEGORY_CONFIG } from "./prayer-topic-category";
import { PRAYER_TOPIC_PRIORITY_CONFIG } from "./prayer-topic-priority";
import { PRAYER_TOPIC_STATUS_LABELS } from "./prayer-topic-status";
import type { PrayerTopic } from "../types/prayer-topic.types";

const CSV_HEADERS = ["Titre", "Catégorie", "Priorité", "Statut", "Date début", "Date fin", "Auteur"];

function escapeCsvField(value: string): string {
  if (!/[",\n]/.test(value)) return value;
  return `"${value.replace(/"/g, '""')}"`;
}

/** Prépare l'export CSV de la vue courante — appelé par `PrayerTopicToolbar`. */
export function buildPrayerTopicsCsv(topics: PrayerTopic[]): string {
  const rows = topics.map((topic) =>
    [
      topic.title,
      PRAYER_TOPIC_CATEGORY_CONFIG[topic.category].label,
      PRAYER_TOPIC_PRIORITY_CONFIG[topic.priority].label,
      PRAYER_TOPIC_STATUS_LABELS[topic.status],
      topic.startDate,
      topic.endDate ?? "",
      topic.authorName,
    ]
      .map((field) => escapeCsvField(field))
      .join(","),
  );

  return [CSV_HEADERS.join(","), ...rows].join("\n");
}

export function downloadPrayerTopicsCsv(topics: PrayerTopic[], fileName = "sujets-de-priere"): void {
  const csv = buildPrayerTopicsCsv(topics);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
