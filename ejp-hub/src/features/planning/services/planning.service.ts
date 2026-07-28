import { isSupabaseConfigured } from "@/shared/lib/supabase/config";
import type { PlanningStatus } from "@/shared/types/database";

import type { PlanningConflict } from "../types/planning.types";
import type { PlanningLeaderOption, PlanningPrayerTopicRef, PrayerSlot } from "../types/planning.types";
import type { PlanningSlotFormValues } from "../validation/planning-slot.schema";
import { MockPlanningRepository } from "./mock-planning-repository";
import { PlanningConflictService } from "./planning-conflict.service";
import type { PlanningRepository } from "./planning-repository";
import { SupabasePlanningRepository } from "./supabase-planning-repository";

/**
 * Point d'entrée unique pour toute donnée du Planning. Les composants et
 * hooks ne connaissent que cette interface — jamais `PlanningRepository`,
 * `planning.queries.ts` ni le client Supabase directement.
 *
 * La bascule mock/réel est entièrement transparente : une fois Supabase
 * configuré, `getRepository()` retourne `SupabasePlanningRepository` sans
 * qu'aucun appelant n'ait à changer.
 */
function getRepository(): PlanningRepository {
  return isSupabaseConfigured() ? SupabasePlanningRepository : MockPlanningRepository;
}

export const PlanningService = {
  async list(): Promise<PrayerSlot[]> {
    return getRepository().list();
  },

  async getById(id: string): Promise<PrayerSlot | null> {
    return getRepository().getById(id);
  },

  /** Conflits qu'aurait le formulaire courant s'il était enregistré tel quel. */
  async checkConflicts(values: PlanningSlotFormValues, editingSlotId?: string): Promise<PlanningConflict[]> {
    const existing = await this.list();
    return PlanningConflictService.detectConflicts(existing, {
      id: editingSlotId,
      date: values.date,
      startTime: values.startTime,
      endTime: values.endTime,
      location: values.location,
      primaryLeaderId: values.primaryLeaderId,
      secondaryLeaderId: values.secondaryLeaderId,
    });
  },

  async create(values: PlanningSlotFormValues): Promise<PrayerSlot> {
    return getRepository().create(values);
  },

  async update(id: string, values: PlanningSlotFormValues): Promise<PrayerSlot> {
    return getRepository().update(id, values);
  },

  /** Utilisé par le glisser-déposer et le redimensionnement dans le calendrier. */
  async reschedule(id: string, schedule: { date: string; startTime: string; endTime: string }): Promise<PrayerSlot> {
    return getRepository().updateSchedule(id, schedule);
  },

  async cancel(id: string): Promise<PrayerSlot> {
    return getRepository().updateStatus(id, "CANCELLED" satisfies PlanningStatus);
  },

  async remove(id: string): Promise<void> {
    return getRepository().remove(id);
  },

  async duplicate(id: string): Promise<PrayerSlot> {
    return getRepository().duplicate(id);
  },

  async listLeaderOptions(): Promise<PlanningLeaderOption[]> {
    return getRepository().listLeaderOptions();
  },

  async listPrayerTopicOptions(): Promise<PlanningPrayerTopicRef[]> {
    return getRepository().listPrayerTopicOptions();
  },

  async listLocationOptions(): Promise<string[]> {
    return getRepository().listLocationOptions();
  },
};
