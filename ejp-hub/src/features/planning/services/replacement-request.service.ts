import { isSupabaseConfigured } from "@/shared/lib/supabase/config";

import type { PlanningLeaderRole, ReplacementRequest } from "../types/planning.types";
import { MockReplacementRequestRepository } from "./mock-replacement-request-repository";
import type { ReplacementRequestRepository } from "./replacement-request-repository";
import { SupabaseReplacementRequestRepository } from "./supabase-replacement-request-repository";

function getRepository(): ReplacementRequestRepository {
  return isSupabaseConfigured() ? SupabaseReplacementRequestRepository : MockReplacementRequestRepository;
}

/** Point d'entrée unique pour les demandes de remplacement — même principe que `PlanningService`. */
export const ReplacementRequestService = {
  async listForSlot(planningId: string): Promise<ReplacementRequest[]> {
    return getRepository().listForSlot(planningId);
  },

  async create(input: {
    planningId: string;
    role: PlanningLeaderRole;
    requestedBy: string;
    proposedMemberId: string;
    comment: string | null;
  }): Promise<ReplacementRequest> {
    return getRepository().create(input);
  },

  async decide(id: string, decision: "APPROVED" | "REJECTED", decidedBy: string): Promise<ReplacementRequest> {
    return getRepository().decide(id, decision, decidedBy);
  },

  async cancel(id: string): Promise<void> {
    return getRepository().cancel(id);
  },
};
