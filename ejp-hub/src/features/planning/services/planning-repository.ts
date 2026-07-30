import type { PlanningStatus } from "@/shared/types/database";

import type {
  PlanningLeaderOption,
  PlanningLeaderRole,
  PlanningPrayerTopicRef,
  PlanningProgramRef,
  PrayerSlot,
} from "../types/planning.types";
import type { AssignmentResponseFormValues } from "../validation/assignment-response.schema";
import type { PlanningSlotFormValues } from "../validation/planning-slot.schema";

/**
 * Contrat d'accès aux données du Planning, indépendant de la source réelle.
 * `PlanningService` ne dépend que de cette interface — jamais d'une
 * implémentation concrète — pour que brancher Supabase se limite à changer
 * `getPlanningRepository()` (voir plus bas), sans toucher au reste du
 * module.
 */
export interface PlanningRepository {
  list(): Promise<PrayerSlot[]>;
  getById(id: string): Promise<PrayerSlot | null>;
  create(values: PlanningSlotFormValues): Promise<PrayerSlot>;
  update(id: string, values: PlanningSlotFormValues): Promise<PrayerSlot>;
  updateSchedule(id: string, schedule: { date: string; startTime: string; endTime: string }): Promise<PrayerSlot>;
  updateStatus(id: string, status: PlanningStatus): Promise<PrayerSlot>;
  /** Réponse (accepter/refuser, avec commentaire) d'un conducteur assigné à sa propre assignation. */
  respondToAssignment(id: string, role: PlanningLeaderRole, values: AssignmentResponseFormValues): Promise<PrayerSlot>;
  remove(id: string): Promise<void>;
  duplicate(id: string): Promise<PrayerSlot>;
  listLeaderOptions(): Promise<PlanningLeaderOption[]>;
  listPrayerTopicOptions(): Promise<PlanningPrayerTopicRef[]>;
  listProgramOptions(): Promise<PlanningProgramRef[]>;
  listLocationOptions(): Promise<string[]>;
}
