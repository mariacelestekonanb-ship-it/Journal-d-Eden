import { z } from "zod";

/**
 * Validation de la seule opération d'écriture non liée au marquage
 * lu/non lu : créer une notification. Sert de garde-fou à
 * `NotificationService.notify(...)` — l'API que les autres modules
 * appelleront pour émettre un événement (voir NOTIFICATIONS.md) — avant
 * même que la requête n'atteigne Supabase ou le dépôt mock.
 */
export const createNotificationSchema = z.object({
  userId: z.string().trim().min(1, "Le destinataire est obligatoire."),
  type: z.enum(["PLANNING", "REPORT", "MEMBER", "PRAYER_TOPIC", "SYSTEM"]),
  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]).optional(),
  title: z.string().trim().min(1, "Le titre est obligatoire.").max(150, "Limité à 150 caractères."),
  message: z.string().trim().min(1, "Le message est obligatoire.").max(500, "Limité à 500 caractères."),
  actionUrl: z.string().trim().max(300, "Limité à 300 caractères.").optional().nullable(),
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
