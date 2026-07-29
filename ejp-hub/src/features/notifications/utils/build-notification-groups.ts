import { isThisWeek, isToday, isYesterday } from "date-fns";

import type { Notification, NotificationGroup } from "../types/notification.types";

const GROUP_LABELS = ["Aujourd'hui", "Hier", "Cette semaine", "Plus ancien"] as const;

/** Regroupe des notifications déjà triées par date décroissante en sections chronologiques, pour `NotificationList`. */
export function buildNotificationGroups(notifications: Notification[]): NotificationGroup[] {
  const buckets: Record<(typeof GROUP_LABELS)[number], Notification[]> = {
    "Aujourd'hui": [],
    Hier: [],
    "Cette semaine": [],
    "Plus ancien": [],
  };

  notifications.forEach((notification) => {
    const date = new Date(notification.createdAt);
    if (isToday(date)) {
      buckets["Aujourd'hui"].push(notification);
    } else if (isYesterday(date)) {
      buckets.Hier.push(notification);
    } else if (isThisWeek(date, { weekStartsOn: 1 })) {
      buckets["Cette semaine"].push(notification);
    } else {
      buckets["Plus ancien"].push(notification);
    }
  });

  return GROUP_LABELS.map((label) => ({ label, notifications: buckets[label] })).filter(
    (group) => group.notifications.length > 0,
  );
}
