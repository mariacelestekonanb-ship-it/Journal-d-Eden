import type { AppBadgeProps } from "@/shared/components/app-badge";

import type { PrayerTopicStatus } from "../types/prayer-topic.types";
import { PRAYER_TOPIC_STATUS_VALUES } from "../validation/prayer-topic.schema";

/** Source unique des libellés et couleurs de statut — utilisée par le badge, le formulaire et les filtres. */
export const PRAYER_TOPIC_STATUS_LABELS: Record<PrayerTopicStatus, string> = {
  DRAFT: "Brouillon",
  ACTIVE: "Actif",
  COMPLETED: "Terminé",
  ARCHIVED: "Archivé",
};

export const PRAYER_TOPIC_STATUS_BADGE_VARIANT: Record<PrayerTopicStatus, NonNullable<AppBadgeProps["variant"]>> = {
  DRAFT: "secondary",
  ACTIVE: "success",
  COMPLETED: "default",
  ARCHIVED: "outline",
};

export const PRAYER_TOPIC_STATUS_OPTIONS = PRAYER_TOPIC_STATUS_VALUES;
