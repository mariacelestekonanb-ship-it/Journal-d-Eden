import type { NotificationPriority as DbNotificationPriority, NotificationType as DbNotificationType } from "@/shared/types/database";

export type NotificationType = DbNotificationType;
export type NotificationPriority = DbNotificationPriority;

/**
 * Une notification — toujours personnelle (`userId`), jamais partagée entre
 * utilisateurs. `isRead` est un dérivé de `readAt` (pas une colonne séparée
 * côté base, voir `DATABASE.md#notifications`) : une seule source de vérité,
 * exposée sous une forme pratique pour les composants.
 */
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  isRead: boolean;
  actionUrl: string | null;
  createdAt: string;
  readAt: string | null;
}

export type NotificationReadFilter = "all" | "read" | "unread";

export interface NotificationFilters {
  search: string;
  type: NotificationType | null;
  priority: NotificationPriority | null;
  readStatus: NotificationReadFilter;
  dateFrom: string | null;
  dateTo: string | null;
}

export const EMPTY_NOTIFICATION_FILTERS: NotificationFilters = {
  search: "",
  type: null,
  priority: null,
  readStatus: "all",
  dateFrom: null,
  dateTo: null,
};

export interface NotificationStatsSummary {
  unreadCount: number;
  todayCount: number;
  thisWeekCount: number;
  byType: Record<NotificationType, number>;
}

/** Un groupe chronologique (Aujourd'hui, Hier, Cette semaine, Plus ancien) affiché par `NotificationList`. */
export interface NotificationGroup {
  label: string;
  notifications: Notification[];
}

/** Callbacks d'action partagés entre `NotificationCard`, `NotificationList`, `NotificationTable` et `NotificationDropdown`. */
export interface NotificationCallbacks {
  onOpen: (notification: Notification) => void;
  onMarkRead: (notification: Notification) => void;
  onDelete: (notification: Notification) => void;
}
