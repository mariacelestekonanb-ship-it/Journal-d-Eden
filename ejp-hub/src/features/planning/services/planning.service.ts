import { createClient } from "@/lib/supabase/client";

import type { ConducteurOption, PlanningSlotWithRelations } from "../types/planning.types";
import type { PlanningSlotFormValues } from "../validation/planning-slot.schema";

const SLOT_SELECT = "*, conducteur:profiles(id, full_name), topic:prayer_topics(id, title)";

export async function listSlotsInRange(startDate: string, endDate: string): Promise<PlanningSlotWithRelations[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("planning_slots")
    .select(SLOT_SELECT)
    .gte("slot_date", startDate)
    .lte("slot_date", endDate)
    .order("slot_date", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) throw new Error(error.message);
  return data as unknown as PlanningSlotWithRelations[];
}

export async function listActiveConducteurs(): Promise<ConducteurOption[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("is_active", true)
    .order("full_name", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function createSlot(values: PlanningSlotFormValues): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("planning_slots").insert({
    slot_date: values.slot_date,
    start_time: values.start_time,
    end_time: values.end_time,
    conducteur_id: values.conducteur_id || null,
    prayer_topic_id: values.prayer_topic_id || null,
    location: values.location || null,
    notes: values.notes || null,
  });

  if (error) throw new Error(error.message);
}

export async function updateSlot(id: string, values: PlanningSlotFormValues): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("planning_slots")
    .update({
      slot_date: values.slot_date,
      start_time: values.start_time,
      end_time: values.end_time,
      conducteur_id: values.conducteur_id || null,
      prayer_topic_id: values.prayer_topic_id || null,
      location: values.location || null,
      notes: values.notes || null,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function deleteSlot(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("planning_slots").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export interface BulkSlotInput {
  slot_date: string;
  start_time: string;
  end_time: string;
  conducteur_full_name?: string;
  location?: string;
  notes?: string;
}

export async function bulkCreateSlots(
  rows: BulkSlotInput[],
  conducteurs: ConducteurOption[],
): Promise<{ inserted: number; skipped: number }> {
  const supabase = createClient();
  const nameToId = new Map(conducteurs.map((c) => [c.full_name.trim().toLowerCase(), c.id]));

  const payload = rows.map((row) => ({
    slot_date: row.slot_date,
    start_time: row.start_time,
    end_time: row.end_time,
    conducteur_id: row.conducteur_full_name ? (nameToId.get(row.conducteur_full_name.trim().toLowerCase()) ?? null) : null,
    location: row.location || null,
    notes: row.notes || null,
  }));

  const { error } = await supabase.from("planning_slots").insert(payload);
  if (error) throw new Error(error.message);

  return { inserted: payload.length, skipped: rows.length - payload.length };
}
