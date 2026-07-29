import type { Role } from "@/shared/constants/roles";

import type { Notification } from "../types/notification.types";
import type { CreateNotificationInput } from "../validation/create-notification.schema";

/**
 * Contexte du visiteur courant. Contrairement aux autres modules, `role`
 * n'accorde ici **aucun** privilège de lecture élargi : une notification
 * n'appartient qu'à un seul utilisateur, y compris pour un `ADMIN` — voir
 * NOTIFICATIONS.md. Le champ est conservé pour rester cohérent avec le
 * contrat des autres `*ListContext` du projet et pour une éventuelle
 * évolution future (ex. diffusion ciblée par rôle), pas parce qu'il change
 * quoi que ce soit aujourd'hui.
 */
export interface NotificationListContext {
  userId: string;
  role: Role;
}

/**
 * Contrat d'accès aux données des Notifications, indépendant de la source
 * réelle. `NotificationService` ne dépend que de cette interface — jamais
 * d'une implémentation concrète.
 */
export interface NotificationRepository {
  list(context: NotificationListContext): Promise<Notification[]>;
  markRead(id: string, context: NotificationListContext): Promise<Notification>;
  markAllRead(context: NotificationListContext): Promise<void>;
  remove(id: string, context: NotificationListContext): Promise<void>;
  create(input: CreateNotificationInput): Promise<Notification>;
}
