import type { AppBadgeProps } from "@/shared/components/app-badge";

import type { NotificationPriority } from "../types/notification.types";

/** Source unique des libellés et couleurs de priorité — utilisée par le badge, les filtres et le tri. */
export const NOTIFICATION_PRIORITY_LABELS: Record<NotificationPriority, string> = {
  LOW: "Basse",
  NORMAL: "Normale",
  HIGH: "Haute",
  URGENT: "Urgente",
};

export const NOTIFICATION_PRIORITY_BADGE_VARIANT: Record<NotificationPriority, NonNullable<AppBadgeProps["variant"]>> = {
  LOW: "secondary",
  NORMAL: "outline",
  HIGH: "warning",
  URGENT: "destructive",
};

export const NOTIFICATION_PRIORITY_OPTIONS: NotificationPriority[] = ["LOW", "NORMAL", "HIGH", "URGENT"];

/** Poids numérique — sert à trier par priorité (urgentes d'abord) dans `NotificationTable`. */
export const NOTIFICATION_PRIORITY_WEIGHT: Record<NotificationPriority, number> = {
  LOW: 0,
  NORMAL: 1,
  HIGH: 2,
  URGENT: 3,
};
