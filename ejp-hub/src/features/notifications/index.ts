/**
 * Point d'entrée public du module Notifications. Les autres modules (et les
 * routes de `src/app/`) ne doivent importer que depuis ce fichier — jamais
 * un chemin profond vers `services/`, `repositories/`, `queries/`, `data/`,
 * etc.
 */
export { NotificationsView } from "./pages/notifications-view";
export { NotificationBell } from "./components/notification-bell";
export type { Notification, NotificationFilters, NotificationPriority, NotificationType } from "./types/notification.types";
export { NotificationService } from "./services/notification.service";
export { getNotificationPermissions, type NotificationPermissions } from "./utils/notification-permissions";
