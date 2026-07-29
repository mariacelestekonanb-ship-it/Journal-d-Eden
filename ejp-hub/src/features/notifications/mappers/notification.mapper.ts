import type { RawNotificationRow } from "../queries/notification.queries";
import type { Notification } from "../types/notification.types";

/**
 * Convertit les lignes brutes de `notification.queries.ts` en `Notification`
 * (le modèle métier utilisé par tous les composants). `isRead` est calculé
 * ici, une seule fois — jamais reproduit ailleurs dans le module.
 */
export const NotificationMapper = {
  toNotification(row: RawNotificationRow): Notification {
    return {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      message: row.message,
      type: row.type,
      priority: row.priority,
      isRead: row.read_at !== null,
      actionUrl: row.action_url,
      createdAt: row.created_at,
      readAt: row.read_at,
    };
  },
};
