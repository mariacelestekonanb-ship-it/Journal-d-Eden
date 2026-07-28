import { PlanningService } from "../services/planning.service";
import type { PrayerSlot } from "../types/planning.types";

export async function duplicateSlotAction(id: string): Promise<PrayerSlot> {
  return PlanningService.duplicate(id);
}
