import type { NotificationListContext } from "../repositories/notification-repository";
import { NotificationService } from "../services/notification.service";

export async function markAllNotificationsReadAction(context: NotificationListContext): Promise<void> {
  return NotificationService.markAllRead(context);
}
