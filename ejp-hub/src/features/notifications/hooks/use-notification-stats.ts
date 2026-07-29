"use client";

import { isThisWeek, isToday } from "date-fns";
import * as React from "react";

import type { Notification, NotificationStatsSummary, NotificationType } from "../types/notification.types";
import { NOTIFICATION_TYPE_OPTIONS } from "../utils/notification-type";
import { useNotifications } from "./use-notifications";

function emptyByType(): Record<NotificationType, number> {
  return NOTIFICATION_TYPE_OPTIONS.reduce(
    (acc, type) => ({ ...acc, [type]: 0 }),
    {} as Record<NotificationType, number>,
  );
}

/** Calcule les indicateurs du module à partir des notifications déjà en cache — aucun appel réseau supplémentaire. */
export function computeNotificationStats(notifications: Notification[]): NotificationStatsSummary {
  const byType = emptyByType();
  notifications.forEach((notification) => {
    byType[notification.type] += 1;
  });

  return {
    unreadCount: notifications.filter((notification) => !notification.isRead).length,
    todayCount: notifications.filter((notification) => isToday(new Date(notification.createdAt))).length,
    thisWeekCount: notifications.filter((notification) => isThisWeek(new Date(notification.createdAt), { weekStartsOn: 1 }))
      .length,
    byType,
  };
}

export function useNotificationStats() {
  const { data: notifications, isLoading } = useNotifications();
  const stats = React.useMemo(() => computeNotificationStats(notifications ?? []), [notifications]);
  return { stats, isLoading };
}

/** Dérivé léger du même cache — alimente `NotificationBell` sans requête dédiée. */
export function useUnreadNotificationsCount(): number {
  const { data: notifications } = useNotifications();
  return React.useMemo(() => (notifications ?? []).filter((notification) => !notification.isRead).length, [notifications]);
}
