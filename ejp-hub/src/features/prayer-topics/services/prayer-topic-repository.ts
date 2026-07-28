import type { PrayerTopic, PrayerTopicAuthorOption } from "../types/prayer-topic.types";
import type { PrayerTopicFormValues } from "../validation/prayer-topic.schema";

/**
 * Contrat d'accès aux données des Sujets de prière, indépendant de la
 * source réelle. `PrayerTopicService` ne dépend que de cette interface —
 * jamais d'une implémentation concrète — pour que brancher Supabase se
 * limite à changer `getRepository()` (voir plus bas), sans toucher au reste
 * du module.
 */
export interface PrayerTopicRepository {
  list(): Promise<PrayerTopic[]>;
  getById(id: string): Promise<PrayerTopic | null>;
  create(values: PrayerTopicFormValues, author: PrayerTopicAuthorOption): Promise<PrayerTopic>;
  update(id: string, values: PrayerTopicFormValues): Promise<PrayerTopic>;
  remove(id: string): Promise<void>;
  duplicate(id: string): Promise<PrayerTopic>;
  archive(id: string): Promise<PrayerTopic>;
  restore(id: string): Promise<PrayerTopic>;
  listAuthorOptions(): Promise<PrayerTopicAuthorOption[]>;
}
