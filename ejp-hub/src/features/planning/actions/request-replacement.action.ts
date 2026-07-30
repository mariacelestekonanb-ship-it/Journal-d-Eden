import { ReplacementRequestService } from "../services/replacement-request.service";
import type { PlanningLeaderRole, ReplacementRequest } from "../types/planning.types";

export async function requestReplacementAction(input: {
  planningId: string;
  role: PlanningLeaderRole;
  requestedBy: string;
  proposedMemberId: string;
  comment: string | null;
}): Promise<ReplacementRequest> {
  return ReplacementRequestService.create(input);
}
