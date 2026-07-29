export interface NotificationPermissions {
  canMarkRead: boolean;
  canDelete: boolean;
}

/**
 * Volontairement symétrique : une notification est toujours strictement
 * personnelle, y compris pour un `ADMIN` (voir NOTIFICATIONS.md#permissions)
 * — il n'existe aucune capacité réservée à un rôle sur ses propres
 * notifications. Ce fichier existe malgré tout, par cohérence avec les
 * autres modules (`getReportPermissions`, `getMemberPermissions`…) et pour
 * qu'une future capacité différenciée (ex. diffuser une notification
 * `SYSTEM` à tous) ait un endroit naturel où vivre sans réorganiser le
 * module.
 */
const SHARED: NotificationPermissions = {
  canMarkRead: true,
  canDelete: true,
};

/** Ne prend délibérément aucun paramètre de rôle — voir le commentaire de tête. */
export function getNotificationPermissions(): NotificationPermissions {
  return SHARED;
}
