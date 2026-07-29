const PHONE_PATTERN = /^\+?[0-9\s.-]{6,20}$/;

/**
 * Règles métier transverses aux Membres, indépendantes de la source des
 * données — utilisées par le service, pas seulement par les schémas Zod des
 * formulaires (qui ne couvrent que la saisie, pas les actions déclenchées
 * par un clic comme « Suspendre » ou « Changer le rôle »).
 */
export const MemberValidationService = {
  isValidPhone(phone: string): boolean {
    return PHONE_PATTERN.test(phone.trim());
  },

  /** Empêche un administrateur de suspendre ou de rétrograder son propre compte — évite un auto-verrouillage. */
  assertNotSelf(actorId: string, targetId: string, action: string): void {
    if (actorId === targetId) {
      throw new Error(`Vous ne pouvez pas ${action} votre propre compte.`);
    }
  },
};
