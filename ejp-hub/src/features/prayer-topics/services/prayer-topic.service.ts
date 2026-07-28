import { isSupabaseConfigured } from "@/shared/lib/supabase/config";

import type { PrayerTopic, PrayerTopicAuthorOption } from "../types/prayer-topic.types";
import type { PrayerTopicFormValues } from "../validation/prayer-topic.schema";
import { MockPrayerTopicRepository } from "./mock-prayer-topic-repository";
import type { PrayerTopicRepository } from "./prayer-topic-repository";
import { SupabasePrayerTopicRepository } from "./supabase-prayer-topic-repository";

/**
 * Point d'entrée unique pour toute donnée des Sujets de prière. Les
 * composants et hooks ne connaissent que cette interface — jamais
 * `PrayerTopicRepository`, `prayer-topic.queries.ts` ni le client Supabase
 * directement.
 *
 * La bascule mock/réel est entièrement transparente : une fois Supabase
 * configuré, `getRepository()` retourne `SupabasePrayerTopicRepository`
 * sans qu'aucun appelant n'ait à changer.
 */
function getRepository(): PrayerTopicRepository {
  return isSupabaseConfigured() ? SupabasePrayerTopicRepository : MockPrayerTopicRepository;
}

export const PrayerTopicService = {
  async list(): Promise<PrayerTopic[]> {
    return getRepository().list();
  },

  async getById(id: string): Promise<PrayerTopic | null> {
    return getRepository().getById(id);
  },

  async create(values: PrayerTopicFormValues, author: PrayerTopicAuthorOption): Promise<PrayerTopic> {
    return getRepository().create(values, author);
  },

  async update(id: string, values: PrayerTopicFormValues): Promise<PrayerTopic> {
    return getRepository().update(id, values);
  },

  async remove(id: string): Promise<void> {
    return getRepository().remove(id);
  },

  async duplicate(id: string): Promise<PrayerTopic> {
    return getRepository().duplicate(id);
  },

  async archive(id: string): Promise<PrayerTopic> {
    return getRepository().archive(id);
  },

  async restore(id: string): Promise<PrayerTopic> {
    return getRepository().restore(id);
  },

  async listAuthorOptions(): Promise<PrayerTopicAuthorOption[]> {
    return getRepository().listAuthorOptions();
  },
};
