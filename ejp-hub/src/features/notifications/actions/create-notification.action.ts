import { NotificationService } from "../services/notification.service";
import type { Notification } from "../types/notification.types";
import type { CreateNotificationInput } from "../validation/create-notification.schema";

/**
 * Façade appelée par `useCreateNotification` — et, à terme, par les autres
 * modules qui émettront un événement (voir `NotificationService.notify`).
 */
export async function createNotificationAction(input: CreateNotificationInput): Promise<Notification> {
  return NotificationService.notify(input);
}
