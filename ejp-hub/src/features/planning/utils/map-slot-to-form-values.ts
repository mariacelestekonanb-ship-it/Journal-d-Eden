import type { PrayerSlot } from "../types/planning.types";
import type { PlanningSlotFormValues } from "../validation/planning-slot.schema";

/** Pré-remplit le formulaire d'édition à partir d'un créneau existant. */
export function mapSlotToFormValues(slot: PrayerSlot): PlanningSlotFormValues {
  return {
    title: slot.title,
    description: slot.description ?? "",
    date: slot.date,
    startTime: slot.startTime,
    endTime: slot.endTime,
    location: slot.location ?? "",
    primaryLeaderId: slot.primaryLeader?.id ?? "",
    secondaryLeaderId: slot.secondaryLeader?.id ?? "",
    theme: slot.theme ?? "",
    prayerTopicId: slot.prayerTopic?.id ?? "",
    status: slot.status,
    notes: slot.notes ?? "",
  };
}
