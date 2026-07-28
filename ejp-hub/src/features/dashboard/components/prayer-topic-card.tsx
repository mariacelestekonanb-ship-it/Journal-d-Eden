"use client";

import { motion } from "framer-motion";

import { AppBadge, type AppBadgeProps } from "@/shared/components/app-badge";
import type { TopicPriority } from "@/shared/types/database";
import { formatDate } from "@/shared/utils/format";

import type { RecentPrayerTopicSummary } from "../types/dashboard.types";

const PRIORITY_CONFIG: Record<TopicPriority, { label: string; variant: AppBadgeProps["variant"] }> = {
  LOW: { label: "Faible", variant: "secondary" },
  MEDIUM: { label: "Normale", variant: "warning" },
  HIGH: { label: "Importante", variant: "destructive" },
};

export interface PrayerTopicCardProps {
  topic: RecentPrayerTopicSummary;
}

/** Résumé d'un sujet de prière — réutilisable partout où un sujet doit être affiché brièvement. */
export function PrayerTopicCard({ topic }: PrayerTopicCardProps) {
  const priority = PRIORITY_CONFIG[topic.priority];

  return (
    <motion.div
      whileHover={{ y: -1 }}
      transition={{ duration: 0.15 }}
      className="rounded-lg border border-border bg-card p-3 focus-within:ring-2 focus-within:ring-ring"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-foreground">{topic.title}</p>
        <AppBadge variant={priority.variant} className="shrink-0">
          {priority.label}
        </AppBadge>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        {formatDate(topic.date, "d MMM yyyy")} · {topic.authorName}
      </p>
    </motion.div>
  );
}
