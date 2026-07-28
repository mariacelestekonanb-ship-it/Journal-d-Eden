import { PrayerTopicService } from "../services/prayer-topic.service";
import type { PrayerTopic } from "../types/prayer-topic.types";

export async function restoreTopicAction(id: string): Promise<PrayerTopic> {
  return PrayerTopicService.restore(id);
}
