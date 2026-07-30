import { ReplacementRequestService } from "../services/replacement-request.service";
import type { ReplacementRequest } from "../types/planning.types";

export async function decideReplacementRequestAction(
  id: string,
  decision: "APPROVED" | "REJECTED",
  decidedBy: string,
): Promise<ReplacementRequest> {
  return ReplacementRequestService.decide(id, decision, decidedBy);
}
