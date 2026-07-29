import { isSupabaseConfigured } from "@/shared/lib/supabase/config";

import { MockNotificationRepository } from "../repositories/mock-notification-repository";
import type { NotificationListContext, NotificationRepository } from "../repositories/notification-repository";
import { SupabaseNotificationRepository } from "../repositories/supabase-notification-repository";
import type { Notification } from "../types/notification.types";
import type { CreateNotificationInput } from "../validation/create-notification.schema";
import { NotificationValidationService } from "./notification-validation.service";

/**
 * Point d'entrée unique pour toute donnée des Notifications. Les
 * composants et hooks — et, à terme, les autres modules qui voudront
 * émettre une notification — ne connaissent que cette interface, jamais
 * `NotificationRepository`, `notification.queries.ts` ni Supabase
 * directement.
 */
function getRepository(): NotificationRepository {
  return isSupabaseConfigured() ? SupabaseNotificationRepository : MockNotificationRepository;
}

export const NotificationService = {
  async list(context: NotificationListContext): Promise<Notification[]> {
    return getRepository().list(context);
  },

  async markRead(id: string, context: NotificationListContext): Promise<Notification> {
    return getRepository().markRead(id, context);
  },

  async markAllRead(context: NotificationListContext): Promise<void> {
    return getRepository().markAllRead(context);
  },

  async remove(id: string, context: NotificationListContext): Promise<void> {
    return getRepository().remove(id, context);
  },

  /**
   * API prête pour les futurs modules producteurs (Planning, Comptes
   * rendus, Membres, Sujets de prière) : `NotificationService.notify({...})`
   * pour émettre un événement. Aucun appelant n'existe encore ailleurs dans
   * l'application — câbler chaque module reste un travail dédié, voir
   * NOTIFICATIONS.md.
   */
  async notify(input: CreateNotificationInput): Promise<Notification> {
    const validInput = NotificationValidationService.assertValidInput(input);
    return getRepository().create(validInput);
  },
};
