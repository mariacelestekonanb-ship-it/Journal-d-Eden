import { ArrowDown, ArrowUp, Equal, Flame, type LucideIcon } from "lucide-react";

import type { AppBadgeProps } from "@/shared/components/app-badge";

import type { PrayerTopicPriority } from "../types/prayer-topic.types";
import { PRAYER_TOPIC_PRIORITY_VALUES } from "../validation/prayer-topic.schema";

export interface PrayerTopicPriorityConfig {
  label: string;
  variant: NonNullable<AppBadgeProps["variant"]>;
  icon: LucideIcon;
  description: string;
}

/**
 * Source unique des priorités — libellé, couleur, icône et description.
 * Architecture volontairement extensible : ajouter une priorité se résume à
 * l'ajouter ici, à l'enum Postgres `prayer_topic_priority` (migration) et à
 * `PRAYER_TOPIC_PRIORITY_VALUES` (schéma Zod) — aucun composant ne compare
 * `priority === "..."` directement.
 */
export const PRAYER_TOPIC_PRIORITY_CONFIG: Record<PrayerTopicPriority, PrayerTopicPriorityConfig> = {
  LOW: { label: "Faible", variant: "outline", icon: ArrowDown, description: "Peut attendre, suivi occasionnel." },
  NORMAL: { label: "Normale", variant: "secondary", icon: Equal, description: "Rythme de prière habituel." },
  HIGH: {
    label: "Importante",
    variant: "warning",
    icon: ArrowUp,
    description: "À prioriser dans les prochains temps de prière.",
  },
  URGENT: {
    label: "Urgente",
    variant: "destructive",
    icon: Flame,
    description: "Nécessite une intercession immédiate.",
  },
};

export const PRAYER_TOPIC_PRIORITY_OPTIONS = PRAYER_TOPIC_PRIORITY_VALUES;
