import { INITIAL_MOCK_NOTIFICATIONS } from "../data/notification.mocks";
import type { Notification } from "../types/notification.types";
import type { NotificationListContext, NotificationRepository } from "./notification-repository";

/**
 * Implémentation en mémoire de `NotificationRepository`, utilisée tant que
 * Supabase n'est pas configuré. L'état est mutable au niveau du module pour
 * que marquer comme lu, tout marquer comme lu et supprimer restent
 * réellement interactifs en mode démo.
 */
let notifications: Notification[] = INITIAL_MOCK_NOTIFICATIONS.map((notification) => ({ ...notification }));

function requireOwnNotification(id: string, context: NotificationListContext): Notification {
  const found = notifications.find((notification) => notification.id === id);
  if (!found || found.userId !== context.userId) {
    throw new Error("Notification introuvable.");
  }
  return found;
}

export const MockNotificationRepository: NotificationRepository = {
  async list(context) {
    return notifications
      .filter((notification) => notification.userId === context.userId)
      .map((notification) => ({ ...notification }));
  },

  async markRead(id, context) {
    const existing = requireOwnNotification(id, context);
    const updated: Notification = { ...existing, isRead: true, readAt: existing.readAt ?? new Date().toISOString() };
    notifications = notifications.map((notification) => (notification.id === id ? updated : notification));
    return updated;
  },

  async markAllRead(context) {
    const now = new Date().toISOString();
    notifications = notifications.map((notification) =>
      notification.userId === context.userId && !notification.isRead
        ? { ...notification, isRead: true, readAt: now }
        : notification,
    );
  },

  async remove(id, context) {
    requireOwnNotification(id, context);
    notifications = notifications.filter((notification) => notification.id !== id);
  },

  async create(input) {
    const created: Notification = {
      id: crypto.randomUUID(),
      userId: input.userId,
      title: input.title,
      message: input.message,
      type: input.type,
      priority: input.priority ?? "NORMAL",
      isRead: false,
      actionUrl: input.actionUrl ?? null,
      createdAt: new Date().toISOString(),
      readAt: null,
    };
    notifications = [created, ...notifications];
    return created;
  },
};
