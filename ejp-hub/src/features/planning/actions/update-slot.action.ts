import { PlanningService } from "../services/planning.service";
import type { PrayerSlot } from "../types/planning.types";
import type { PlanningSlotFormValues } from "../validation/planning-slot.schema";

export async function updateSlotAction(id: string, values: PlanningSlotFormValues): Promise<PrayerSlot> {
  return PlanningService.update(id, values);
}

export async function rescheduleSlotAction(
  id: string,
  schedule: { date: string; startTime: string; endTime: string },
): Promise<PrayerSlot> {
  return PlanningService.reschedule(id, schedule);
}
