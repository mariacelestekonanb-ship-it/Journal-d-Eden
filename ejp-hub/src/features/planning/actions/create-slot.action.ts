import { PlanningService } from "../services/planning.service";
import type { PrayerSlot } from "../types/planning.types";
import type { PlanningSlotFormValues } from "../validation/planning-slot.schema";

/**
 * Actions = la surface d'écriture du module, appelée par les hooks
 * (`use-planning-mutations.ts`) et par rien d'autre. Aujourd'hui de simples
 * façades vers `PlanningService` ; le jour où une mutation nécessitera un
 * contexte serveur (ex. clé de service Supabase), seul ce fichier change.
 */
export async function createSlotAction(values: PlanningSlotFormValues): Promise<PrayerSlot> {
  return PlanningService.create(values);
}
