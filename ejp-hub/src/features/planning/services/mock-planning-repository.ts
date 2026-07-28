import type { PlanningStatus } from "@/shared/types/database";

import {
  INITIAL_MOCK_SLOTS,
  MOCK_LEADERS,
  MOCK_LOCATIONS,
  MOCK_PRAYER_TOPICS,
} from "../data/planning.mocks";
import type { PlanningLeaderOption, PlanningPrayerTopicRef, PrayerSlot } from "../types/planning.types";
import type { PlanningSlotFormValues } from "../validation/planning-slot.schema";
import type { PlanningRepository } from "./planning-repository";

/**
 * Implémentation en mémoire de `PlanningRepository`, utilisée tant que
 * Supabase n'est pas configuré. L'état est mutable au niveau du module pour
 * que les actions (créer, modifier, dupliquer, glisser-déposer…) restent
 * réellement interactives en mode démo — pas de simple données figées.
 */
let slots: PrayerSlot[] = INITIAL_MOCK_SLOTS.map((slot) => ({ ...slot }));

function findLeader(id: string | undefined | null): PrayerSlot["primaryLeader"] {
  if (!id) return null;
  return MOCK_LEADERS.find((leader) => leader.id === id) ?? null;
}

function findTopic(id: string | undefined | null): PrayerSlot["prayerTopic"] {
  if (!id) return null;
  return MOCK_PRAYER_TOPICS.find((topic) => topic.id === id) ?? null;
}

function buildSlot(id: string, values: PlanningSlotFormValues, existing?: PrayerSlot): PrayerSlot {
  const now = new Date().toISOString();
  return {
    id,
    title: values.title,
    description: values.description || null,
    date: values.date,
    startTime: values.startTime,
    endTime: values.endTime,
    location: values.location || null,
    primaryLeader: findLeader(values.primaryLeaderId),
    secondaryLeader: findLeader(values.secondaryLeaderId),
    status: values.status,
    theme: values.theme || null,
    prayerTopic: findTopic(values.prayerTopicId),
    notes: values.notes || null,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
}

function requireSlot(id: string): PrayerSlot {
  const found = slots.find((slot) => slot.id === id);
  if (!found) throw new Error("Créneau introuvable.");
  return found;
}

export const MockPlanningRepository: PlanningRepository = {
  async list() {
    return slots.map((slot) => ({ ...slot }));
  },

  async getById(id) {
    return slots.find((slot) => slot.id === id) ?? null;
  },

  async create(values) {
    const created = buildSlot(crypto.randomUUID(), values);
    slots = [...slots, created];
    return created;
  },

  async update(id, values) {
    const existing = requireSlot(id);
    const updated = buildSlot(id, values, existing);
    slots = slots.map((slot) => (slot.id === id ? updated : slot));
    return updated;
  },

  async updateSchedule(id, schedule) {
    const existing = requireSlot(id);
    const updated: PrayerSlot = {
      ...existing,
      date: schedule.date,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      updatedAt: new Date().toISOString(),
    };
    slots = slots.map((slot) => (slot.id === id ? updated : slot));
    return updated;
  },

  async updateStatus(id, status: PlanningStatus) {
    const existing = requireSlot(id);
    const updated: PrayerSlot = { ...existing, status, updatedAt: new Date().toISOString() };
    slots = slots.map((slot) => (slot.id === id ? updated : slot));
    return updated;
  },

  async remove(id) {
    slots = slots.filter((slot) => slot.id !== id);
  },

  async duplicate(id) {
    const existing = requireSlot(id);
    const duplicated: PrayerSlot = {
      ...existing,
      id: crypto.randomUUID(),
      title: `${existing.title} (copie)`,
      status: "DRAFT",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    slots = [...slots, duplicated];
    return duplicated;
  },

  async listLeaderOptions(): Promise<PlanningLeaderOption[]> {
    return MOCK_LEADERS.map((leader) => ({ ...leader }));
  },

  async listPrayerTopicOptions(): Promise<PlanningPrayerTopicRef[]> {
    return MOCK_PRAYER_TOPICS.map((topic) => ({ ...topic }));
  },

  async listLocationOptions(): Promise<string[]> {
    return [...MOCK_LOCATIONS];
  },
};
