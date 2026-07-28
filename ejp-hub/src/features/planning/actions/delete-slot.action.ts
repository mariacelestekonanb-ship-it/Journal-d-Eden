import { PlanningService } from "../services/planning.service";

export async function deleteSlotAction(id: string): Promise<void> {
  return PlanningService.remove(id);
}
