import { NotificationMapper } from "../mappers/notification.mapper";
import {
  createNotificationQuery,
  deleteNotificationQuery,
  markAllNotificationsReadQuery,
  markNotificationReadQuery,
  queryAllNotifications,
} from "../queries/notification.queries";
import type { NotificationRepository } from "./notification-repository";

/**
 * Implémentation réelle de `NotificationRepository`, branchée sur Supabase
 * via la clé `anon` (soumise à la RLS `notifications_select_own` /
 * `_update_own` / `_delete_own` / `_insert_self_or_admin`).
 */
export const SupabaseNotificationRepository: NotificationRepository = {
  async list(context) {
    const rows = await queryAllNotifications(context.userId);
    return rows.map(NotificationMapper.toNotification);
  },

  async markRead(id, context) {
    const row = await markNotificationReadQuery(id, context.userId);
    return NotificationMapper.toNotification(row);
  },

  async markAllRead(context) {
    await markAllNotificationsReadQuery(context.userId);
  },

  async remove(id, context) {
    await deleteNotificationQuery(id, context.userId);
  },

  async create(input) {
    const row = await createNotificationQuery(input);
    return NotificationMapper.toNotification(row);
  },
};
