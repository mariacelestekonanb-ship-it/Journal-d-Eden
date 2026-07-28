import * as React from "react";

import { AppBadge } from "@/shared/components/app-badge";
import { cn } from "@/shared/lib/utils";

import type { PrayerTopicPriority } from "../types/prayer-topic.types";
import { PRAYER_TOPIC_PRIORITY_CONFIG } from "../utils/prayer-topic-priority";

export interface PrayerTopicPriorityBadgeProps {
  priority: PrayerTopicPriority;
  className?: string;
}

function PrayerTopicPriorityBadgeComponent({ priority, className }: PrayerTopicPriorityBadgeProps) {
  const config = PRAYER_TOPIC_PRIORITY_CONFIG[priority];
  const Icon = config.icon;

  return (
    <AppBadge variant={config.variant} className={cn("gap-1", className)} title={config.description}>
      <Icon className="size-3" aria-hidden="true" />
      {config.label}
    </AppBadge>
  );
}

/** Badge de priorité réutilisable — couleur, icône et description viennent de `PRAYER_TOPIC_PRIORITY_CONFIG`. */
export const PrayerTopicPriorityBadge = React.memo(PrayerTopicPriorityBadgeComponent);
