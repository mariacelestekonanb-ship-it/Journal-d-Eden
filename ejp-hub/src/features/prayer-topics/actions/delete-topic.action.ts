import { PrayerTopicService } from "../services/prayer-topic.service";

export async function deleteTopicAction(id: string): Promise<void> {
  return PrayerTopicService.remove(id);
}
