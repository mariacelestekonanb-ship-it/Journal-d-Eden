import { getFullName } from "@/shared/utils/get-full-name";

import type { RawReplacementRequestProfile, RawReplacementRequestRow } from "../queries/replacement-request.queries";
import type { PlanningParticipant, ReplacementRequest } from "../types/planning.types";

function toParticipant(profile: RawReplacementRequestProfile): PlanningParticipant {
  return { id: profile.id, fullName: getFullName(profile) };
}

export const ReplacementRequestMapper = {
  toReplacementRequest(row: RawReplacementRequestRow): ReplacementRequest {
    return {
      id: row.id,
      planningId: row.planning_id,
      role: row.role,
      requestedBy: toParticipant(row.requested_by),
      proposedMember: toParticipant(row.proposed_member),
      comment: row.comment,
      status: row.status,
      createdAt: row.created_at,
      decidedAt: row.decided_at,
    };
  },
};
