import { createNotificationSchema, type CreateNotificationInput } from "../validation/create-notification.schema";

/**
 * Garde-fou de `NotificationService.notify(...)` — la porte d'entrée que les
 * autres modules utiliseront pour émettre un événement. Valide la forme de
 * l'entrée avant tout accès au dépôt (mock ou Supabase) : un futur appelant
 * qui se trompe de type ou oublie un champ obtient un message clair
 * immédiatement, plutôt qu'une erreur de contrainte SQL opaque.
 */
export const NotificationValidationService = {
  assertValidInput(input: CreateNotificationInput): CreateNotificationInput {
    const result = createNotificationSchema.safeParse(input);
    if (!result.success) {
      const firstIssue = result.error.issues[0];
      throw new Error(firstIssue?.message ?? "Notification invalide.");
    }
    return result.data;
  },
};
