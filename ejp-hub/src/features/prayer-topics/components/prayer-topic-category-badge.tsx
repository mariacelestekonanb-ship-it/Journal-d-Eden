import * as React from "react";

import { AppBadge } from "@/shared/components/app-badge";
import { cn } from "@/shared/lib/utils";

import type { PrayerTopicCategory } from "../types/prayer-topic.types";
import { PRAYER_TOPIC_CATEGORY_CONFIG } from "../utils/prayer-topic-category";

export interface PrayerTopicCategoryBadgeProps {
  category: PrayerTopicCategory;
  className?: string;
}

function PrayerTopicCategoryBadgeComponent({ category, className }: PrayerTopicCategoryBadgeProps) {
  const config = PRAYER_TOPIC_CATEGORY_CONFIG[category];
  const Icon = config.icon;

  return (
    <AppBadge variant="outline" className={cn("gap-1", className)} title={config.description}>
      <Icon className="size-3" aria-hidden="true" />
      {config.label}
    </AppBadge>
  );
}

/** Badge de catégorie réutilisable — couleur neutre, l'icône suffit à distinguer les 7 catégories. */
export const PrayerTopicCategoryBadge = React.memo(PrayerTopicCategoryBadgeComponent);
