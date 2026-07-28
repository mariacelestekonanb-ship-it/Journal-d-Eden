import { Archive, FilePlus2, Pencil } from "lucide-react";

import type { PrayerTopic, PrayerTopicTimelineEntry } from "../types/prayer-topic.types";

/** Historique (création, modification, archivage) d'un sujet — affiché dans le tiroir de détail. */
export function buildTopicLifecycleTimeline(topic: PrayerTopic): PrayerTopicTimelineEntry[] {
  const entries: PrayerTopicTimelineEntry[] = [
    { id: `${topic.id}-created`, label: "Sujet créé", description: topic.authorName, timestamp: topic.createdAt, icon: FilePlus2 },
  ];

  if (topic.updatedAt !== topic.createdAt) {
    entries.push({ id: `${topic.id}-updated`, label: "Dernière modification", timestamp: topic.updatedAt, icon: Pencil });
  }

  if (topic.archivedAt) {
    entries.push({ id: `${topic.id}-archived`, label: "Sujet archivé", timestamp: topic.archivedAt, icon: Archive });
  }

  return entries.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

/** Derniers sujets créés — affichés sur le tableau de bord du module. */
export function buildRecentTopicsTimeline(topics: PrayerTopic[], limit = 5): PrayerTopicTimelineEntry[] {
  return [...topics]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit)
    .map((topic) => ({
      id: topic.id,
      label: topic.title,
      description: topic.authorName,
      timestamp: topic.createdAt,
      icon: FilePlus2,
    }));
}
