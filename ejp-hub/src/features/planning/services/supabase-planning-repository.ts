import { getFullName } from "@/shared/utils/get-full-name";

import { PlanningMapper } from "../mappers/planning.mapper";
import {
  createPlanningSlotQuery,
  deletePlanningSlotQuery,
  queryActiveLeaders,
  queryActivePrayerTopics,
  queryAllPlanningSlots,
  updatePlanningSlotQuery,
  updatePlanningSlotScheduleQuery,
  updatePlanningSlotStatusQuery,
} from "../queries/planning.queries";
import type { PlanningRepository } from "./planning-repository";

/**
 * Implémentation réelle de `PlanningRepository`, branchée sur Supabase.
 * Utilisée dès que `isSupabaseConfigured()` renvoie `true` (voir
 * `getPlanningRepository()` dans `planning.service.ts`).
 */
export const SupabasePlanningRepository: PlanningRepository = {
  async list() {
    const rows = await queryAllPlanningSlots();
    return rows.map(PlanningMapper.toPrayerSlot);
  },

  async getById(id) {
    const rows = await queryAllPlanningSlots();
    const row = rows.find((candidate) => candidate.id === id);
    return row ? PlanningMapper.toPrayerSlot(row) : null;
  },

  async create(values) {
    const row = await createPlanningSlotQuery(values);
    return PlanningMapper.toPrayerSlot(row);
  },

  async update(id, values) {
    const row = await updatePlanningSlotQuery(id, values);
    return PlanningMapper.toPrayerSlot(row);
  },

  async updateSchedule(id, schedule) {
    const row = await updatePlanningSlotScheduleQuery(id, schedule);
    return PlanningMapper.toPrayerSlot(row);
  },

  async updateStatus(id, status) {
    const row = await updatePlanningSlotStatusQuery(id, status);
    return PlanningMapper.toPrayerSlot(row);
  },

  async remove(id) {
    await deletePlanningSlotQuery(id);
  },

  async duplicate(id) {
    const rows = await queryAllPlanningSlots();
    const existing = rows.find((candidate) => candidate.id === id);
    if (!existing) throw new Error("Créneau introuvable.");

    const duplicated = await createPlanningSlotQuery({
      title: `${existing.title} (copie)`,
      description: existing.description ?? "",
      date: existing.slot_date,
      startTime: existing.start_time,
      endTime: existing.end_time,
      location: existing.location ?? "",
      primaryLeaderId: existing.primary_leader?.id ?? "",
      secondaryLeaderId: existing.secondary_leader?.id ?? "",
      theme: existing.theme ?? "",
      prayerTopicId: existing.prayer_topic?.id ?? "",
      status: "DRAFT",
      notes: existing.notes ?? "",
    });
    return PlanningMapper.toPrayerSlot(duplicated);
  },

  async listLeaderOptions() {
    const rows = await queryActiveLeaders();
    return rows.map((row) => ({ id: row.id, fullName: getFullName(row) }));
  },

  async listPrayerTopicOptions() {
    return queryActivePrayerTopics();
  },

  async listLocationOptions() {
    // Les lieux ne sont pas (encore) une table dédiée : dérivés des créneaux existants.
    const rows = await queryAllPlanningSlots();
    return Array.from(new Set(rows.map((row) => row.location).filter((value): value is string => !!value)));
  },
};
