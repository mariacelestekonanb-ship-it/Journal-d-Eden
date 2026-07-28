import { PrayerTopicService } from "../services/prayer-topic.service";
import type { PrayerTopic } from "../types/prayer-topic.types";
import type { PrayerTopicFormValues } from "../validation/prayer-topic.schema";

export async function updateTopicAction(id: string, values: PrayerTopicFormValues): Promise<PrayerTopic> {
  return PrayerTopicService.update(id, values);
}
