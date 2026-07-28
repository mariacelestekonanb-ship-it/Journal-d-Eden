import { PrayerTopicService } from "../services/prayer-topic.service";
import type { PrayerTopic, PrayerTopicAuthorOption } from "../types/prayer-topic.types";
import type { PrayerTopicFormValues } from "../validation/prayer-topic.schema";

/**
 * Actions = la surface d'écriture du module, appelée par les hooks
 * (`use-prayer-topic-mutations.ts`) et par rien d'autre. Aujourd'hui de
 * simples façades vers `PrayerTopicService` ; le jour où une mutation
 * nécessitera un contexte serveur, seul ce fichier change.
 */
export async function createTopicAction(
  values: PrayerTopicFormValues,
  author: PrayerTopicAuthorOption,
): Promise<PrayerTopic> {
  return PrayerTopicService.create(values, author);
}
