import type { MemberStatus } from "../types/member.types";

/**
 * Machine à états du workflow d'adhésion — pure et indépendante des rôles
 * (les permissions par rôle vivent dans `utils/member-permissions.ts`,
 * combinées à ce service par les composants) :
 *
 *   PENDING ──accept──► ACTIVE ──suspend──► SUSPENDED
 *      │                  ▲                    │
 *      └──refuse──► REFUSED                    └──reactivate──┘
 *
 * `deleted_at` (suppression douce, voir MEMBERS.md#suppression) est
 * orthogonal à ce statut — un membre supprimé garde son `status` sous-jacent
 * (l'historique reste cohérent) mais ne peut plus se connecter, exactement
 * comme SUSPENDED.
 */
export const MemberWorkflowService = {
  isAcceptable(status: MemberStatus): boolean {
    return status === "PENDING";
  },

  isRefusable(status: MemberStatus): boolean {
    return status === "PENDING";
  },

  isSuspendable(status: MemberStatus): boolean {
    return status === "ACTIVE";
  },

  isReactivatable(status: MemberStatus): boolean {
    return status === "SUSPENDED";
  },

  isDeletable(deletedAt: string | null): boolean {
    return !deletedAt;
  },

  isRestorable(deletedAt: string | null): boolean {
    return !!deletedAt;
  },
};
