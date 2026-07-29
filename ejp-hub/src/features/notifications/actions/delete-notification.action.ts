import type { NotificationListContext } from "../repositories/notification-repository";
import { NotificationService } from "../services/notification.service";

export async function deleteNotificationAction(id: string, context: NotificationListContext): Promise<void> {
  return NotificationService.remove(id, context);
}
