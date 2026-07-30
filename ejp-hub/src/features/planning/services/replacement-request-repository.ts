import type { PlanningLeaderRole, ReplacementRequest } from "../types/planning.types";

/**
 * Contrat d'accès aux données des demandes de remplacement, indépendant de
 * la source réelle — même principe que `PlanningRepository`.
 */
export interface ReplacementRequestRepository {
  listForSlot(planningId: string): Promise<ReplacementRequest[]>;
  create(input: {
    planningId: string;
    role: PlanningLeaderRole;
    requestedBy: string;
    proposedMemberId: string;
    comment: string | null;
  }): Promise<ReplacementRequest>;
  decide(id: string, decision: "APPROVED" | "REJECTED", decidedBy: string): Promise<ReplacementRequest>;
  cancel(id: string): Promise<void>;
}
