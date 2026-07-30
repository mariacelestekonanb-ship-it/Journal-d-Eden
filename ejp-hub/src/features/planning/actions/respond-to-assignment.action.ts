import { PlanningService } from "../services/planning.service";
import type { PlanningLeaderRole, PrayerSlot } from "../types/planning.types";
import type { AssignmentResponseFormValues } from "../validation/assignment-response.schema";

export async function respondToAssignmentAction(
  id: string,
  role: PlanningLeaderRole,
  values: AssignmentResponseFormValues,
): Promise<PrayerSlot> {
  return PlanningService.respondToAssignment(id, role, values);
}
