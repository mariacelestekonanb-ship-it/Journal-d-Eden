import type { Role } from "@/shared/constants/roles";

import type { Testimony } from "../types/testimony.types";

/**
 * Tout utilisateur connecté (ADMIN ou PRAYER_LEADER) peut publier librement —
 * aucune modération. Seule la suppression est restreinte : son auteur, ou
 * un admin pour n'importe quel témoignage.
 */
export function canDeleteTestimony(testimony: Testimony, userId: string, role: Role): boolean {
  return role === "ADMIN" || testimony.author.id === userId;
}
