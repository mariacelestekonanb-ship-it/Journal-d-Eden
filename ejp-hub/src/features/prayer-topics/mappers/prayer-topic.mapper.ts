import { getFullName } from "@/shared/utils/get-full-name";

import type { RawPrayerTopicRow } from "../queries/prayer-topic.queries";
import type { PrayerTopic } from "../types/prayer-topic.types";

/**
 * Convertit les lignes brutes de `prayer-topic.queries.ts` en `PrayerTopic`
 * (le modèle métier utilisé par tous les composants). Isole le reste du
 * module de la forme exacte de la table — un renommage de colonne ne
 * touche que ce fichier.
 */
export const PrayerTopicMapper = {
  toPrayerTopic(row: RawPrayerTopicRow): PrayerTopic {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      priority: row.priority,
      status: row.status,
      startDate: row.start_date,
      endDate: row.end_date,
      authorId: row.author?.id ?? "",
      authorName: row.author ? getFullName(row.author) : "Auteur inconnu",
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      archivedAt: row.archived_at,
    };
  },
};
