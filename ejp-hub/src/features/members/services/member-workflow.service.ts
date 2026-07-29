import type { MemberStatus } from "../types/member.types";

/**
 * Machine à états du workflow d'adhésion — pure et indépendante des rôles
 * (les permissions par rôle vivent dans `utils/member-permissions.ts`,
 * combinées à ce service par les composants) :
 *
 *   PENDING ──accept──► ACTIVE ──suspend──► SUSPENDED
 *      │                  ▲                    │
 *      └──refuse──► REFUSED                    └──reactivate──┘
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
};
