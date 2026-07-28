import * as React from "react";

import { AppBadge } from "@/shared/components/app-badge";

import type { PrayerTopicStatus } from "../types/prayer-topic.types";
import { PRAYER_TOPIC_STATUS_BADGE_VARIANT, PRAYER_TOPIC_STATUS_LABELS } from "../utils/prayer-topic-status";

export interface PrayerTopicStatusBadgeProps {
  status: PrayerTopicStatus;
  className?: string;
}

function PrayerTopicStatusBadgeComponent({ status, className }: PrayerTopicStatusBadgeProps) {
  return (
    <AppBadge variant={PRAYER_TOPIC_STATUS_BADGE_VARIANT[status]} className={className}>
      {PRAYER_TOPIC_STATUS_LABELS[status]}
    </AppBadge>
  );
}

/** Badge de statut réutilisable (liste, cartes, détail, futurs modules dépendants). */
export const PrayerTopicStatusBadge = React.memo(PrayerTopicStatusBadgeComponent);
