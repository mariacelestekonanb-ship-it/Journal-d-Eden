import { createClient } from "@/shared/lib/supabase/client";
import type { PlanningStatus } from "@/shared/types/database";

import type { PlanningSlotFormValues } from "../validation/planning-slot.schema";

/**
 * Requêtes Supabase brutes du module Planning. Ce fichier est le seul à
 * connaître le schéma de la table `planning` — jamais appelé depuis un
 * composant (voir `services/planning-repository.ts`).
 *
 * `planning` a deux relations vers `profiles` (conducteur principal et
 * secondaire) : les alias d'embedding doivent donc préciser la contrainte
 * (`!planning_..._fkey`) pour lever toute ambiguïté côté PostgREST.
 */

export interface RawPlanningLeader {
  id: string;
  firstname: string;
  lastname: string;
}

export interface RawPlanningRow {
  id: string;
  title: string;
  description: string | null;
  slot_date: string;
  start_time: string;
  end_time: string;
  location: string | null;
  status: PlanningStatus;
  theme: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  primary_leader: RawPlanningLeader | null;
  secondary_leader: RawPlanningLeader | null;
  prayer_topic: { id: string; title: string } | null;
  program: { id: string; name: string } | null;
}

const PLANNING_SELECT = `
  id, title, description, slot_date, start_time, end_time, location, status, theme, notes, created_at, updated_at,
  primary_leader:profiles!planning_prayer_leader_id_fkey(id, firstname, lastname),
  secondary_leader:profiles!planning_secondary_leader_id_fkey(id, firstname, lastname),
  prayer_topic:prayer_topics(id, title),
  program:programs(id, name)
`;

function toInsertPayload(values: PlanningSlotFormValues) {
  return {
    title: values.title,
    description: values.description || null,
    slot_date: values.date,
    start_time: values.startTime,
    end_time: values.endTime,
    location: values.location || null,
    prayer_leader_id: values.primaryLeaderId,
    secondary_leader_id: values.secondaryLeaderId || null,
    theme: values.theme || null,
    prayer_topic_id: values.prayerTopicId || null,
    program_id: values.programId || null,
    status: values.status,
    notes: values.notes || null,
  };
}

export async function queryPlanningSlotsInRange(startDate: string, endDate: string): Promise<RawPlanningRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("planning")
    .select(PLANNING_SELECT)
    .gte("slot_date", startDate)
    .lte("slot_date", endDate)
    .order("slot_date", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) throw new Error(error.message);
  return data as unknown as RawPlanningRow[];
}

export async function queryAllPlanningSlots(): Promise<RawPlanningRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("planning")
    .select(PLANNING_SELECT)
    .order("slot_date", { ascending: false })
    .order("start_time", { ascending: false });

  if (error) throw new Error(error.message);
  return data as unknown as RawPlanningRow[];
}

export async function createPlanningSlotQuery(values: PlanningSlotFormValues): Promise<RawPlanningRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("planning")
    .insert(toInsertPayload(values))
    .select(PLANNING_SELECT)
    .single();

  if (error) throw new Error(error.message);
  return data as unknown as RawPlanningRow;
}

export async function updatePlanningSlotQuery(id: string, values: PlanningSlotFormValues): Promise<RawPlanningRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("planning")
    .update(toInsertPayload(values))
    .eq("id", id)
    .select(PLANNING_SELECT)
    .single();

  if (error) throw new Error(error.message);
  return data as unknown as RawPlanningRow;
}

export async function updatePlanningSlotScheduleQuery(
  id: string,
  schedule: { date: string; startTime: string; endTime: string },
): Promise<RawPlanningRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("planning")
    .update({ slot_date: schedule.date, start_time: schedule.startTime, end_time: schedule.endTime })
    .eq("id", id)
    .select(PLANNING_SELECT)
    .single();

  if (error) throw new Error(error.message);
  return data as unknown as RawPlanningRow;
}

export async function updatePlanningSlotStatusQuery(id: string, status: PlanningStatus): Promise<RawPlanningRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("planning")
    .update({ status })
    .eq("id", id)
    .select(PLANNING_SELECT)
    .single();

  if (error) throw new Error(error.message);
  return data as unknown as RawPlanningRow;
}

export async function deletePlanningSlotQuery(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("planning").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function queryActiveLeaders(): Promise<RawPlanningLeader[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, firstname, lastname")
    .eq("is_active", true)
    .order("firstname", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function queryActivePrayerTopics(): Promise<{ id: string; title: string }[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("prayer_topics")
    .select("id, title")
    .eq("status", "ACTIVE")
    .order("title", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function queryProgramOptions(): Promise<{ id: string; name: string }[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("programs").select("id, name").order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}
