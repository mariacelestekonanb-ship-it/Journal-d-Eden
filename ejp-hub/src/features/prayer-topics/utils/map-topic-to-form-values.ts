import type { PrayerTopic } from "../types/prayer-topic.types";
import type { PrayerTopicFormValues } from "../validation/prayer-topic.schema";

/** Pré-remplit le formulaire d'édition à partir d'un sujet existant. */
export function mapTopicToFormValues(topic: PrayerTopic): PrayerTopicFormValues {
  return {
    title: topic.title,
    description: topic.description ?? "",
    category: topic.category,
    priority: topic.priority,
    status: topic.status,
    startDate: topic.startDate,
    endDate: topic.endDate ?? "",
  };
}
