import { PrayerTopicService } from "../services/prayer-topic.service";
import type { PrayerTopic } from "../types/prayer-topic.types";

export async function duplicateTopicAction(id: string): Promise<PrayerTopic> {
  return PrayerTopicService.duplicate(id);
}
