import type { NotificationListContext } from "../repositories/notification-repository";
import { NotificationService } from "../services/notification.service";
import type { Notification } from "../types/notification.types";

export async function markNotificationReadAction(id: string, context: NotificationListContext): Promise<Notification> {
  return NotificationService.markRead(id, context);
}
