import type { UserRole } from "@/shared/types/database";

/**
 * Source unique de vérité pour les rôles applicatifs. Ajouter un rôle plus
 * tard se résume à : l'ajouter ici, à l'enum Postgres `user_role`
 * (migration), et à `ROLE_LABELS` — rien d'autre ne référence les rôles en
 * dur (les guards et permissions ci-dessous sont génériques).
 */
export const ROLES = ["ADMIN", "PRAYER_LEADER"] as const satisfies readonly UserRole[];

export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Administrateur",
  PRAYER_LEADER: "Conducteur de prière",
};

export function isRole(value: string): value is Role {
  return (ROLES as readonly string[]).includes(value);
}
