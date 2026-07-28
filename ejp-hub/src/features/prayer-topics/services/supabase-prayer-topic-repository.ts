import { getFullName } from "@/shared/utils/get-full-name";

import { PrayerTopicMapper } from "../mappers/prayer-topic.mapper";
import {
  createPrayerTopicQuery,
  deletePrayerTopicQuery,
  queryActiveAuthors,
  queryAllPrayerTopics,
  updatePrayerTopicQuery,
  updatePrayerTopicStatusQuery,
} from "../queries/prayer-topic.queries";
import type { PrayerTopicRepository } from "./prayer-topic-repository";

/**
 * Implémentation réelle de `PrayerTopicRepository`, branchée sur Supabase.
 * Utilisée dès que `isSupabaseConfigured()` renvoie `true` (voir
 * `getRepository()` dans `prayer-topic.service.ts`).
 */
export const SupabasePrayerTopicRepository: PrayerTopicRepository = {
  async list() {
    const rows = await queryAllPrayerTopics();
    return rows.map(PrayerTopicMapper.toPrayerTopic);
  },

  async getById(id) {
    const rows = await queryAllPrayerTopics();
    const row = rows.find((candidate) => candidate.id === id);
    return row ? PrayerTopicMapper.toPrayerTopic(row) : null;
  },

  async create(values, author) {
    const row = await createPrayerTopicQuery(values, author.id);
    return PrayerTopicMapper.toPrayerTopic(row);
  },

  async update(id, values) {
    const row = await updatePrayerTopicQuery(id, values);
    return PrayerTopicMapper.toPrayerTopic(row);
  },

  async remove(id) {
    await deletePrayerTopicQuery(id);
  },

  async duplicate(id) {
    const rows = await queryAllPrayerTopics();
    const existing = rows.find((candidate) => candidate.id === id);
    if (!existing) throw new Error("Sujet de prière introuvable.");

    const duplicated = await createPrayerTopicQuery(
      {
        title: `${existing.title} (copie)`,
        description: existing.description ?? "",
        category: existing.category,
        priority: existing.priority,
        status: "DRAFT",
        startDate: existing.start_date,
        endDate: existing.end_date ?? "",
      },
      existing.author?.id ?? "",
    );
    return PrayerTopicMapper.toPrayerTopic(duplicated);
  },

  async archive(id) {
    const row = await updatePrayerTopicStatusQuery(id, "ARCHIVED", new Date().toISOString());
    return PrayerTopicMapper.toPrayerTopic(row);
  },

  async restore(id) {
    const row = await updatePrayerTopicStatusQuery(id, "ACTIVE", null);
    return PrayerTopicMapper.toPrayerTopic(row);
  },

  async listAuthorOptions() {
    const rows = await queryActiveAuthors();
    return rows.map((row) => ({ id: row.id, fullName: getFullName(row) }));
  },
};
