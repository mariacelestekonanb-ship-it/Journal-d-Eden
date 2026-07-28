import { createClient } from "@/lib/supabase/client";

import type { PendingSlot, ReportWithSlot } from "../types/report.types";
import type { ReportFormValues } from "../validation/report.schema";

const REPORT_SELECT =
  "*, conducteur:profiles!reports_conducteur_id_fkey(id, full_name), slot:planning_slots(id, slot_date, start_time, end_time, location, topic:prayer_topics(id, title))";

export async function listReports(scope: "own" | "all", userId: string): Promise<ReportWithSlot[]> {
  const supabase = createClient();
  let query = supabase.from("reports").select(REPORT_SELECT).order("submitted_at", { ascending: false });

  if (scope === "own") {
    query = query.eq("conducteur_id", userId);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data as unknown as ReportWithSlot[];
}

export async function listPendingSlots(userId: string): Promise<PendingSlot[]> {
  const supabase = createClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data: slots, error } = await supabase
    .from("planning_slots")
    .select("id, slot_date, start_time, end_time, location, topic:prayer_topics(id, title)")
    .eq("conducteur_id", userId)
    .lte("slot_date", today)
    .order("slot_date", { ascending: false });

  if (error) throw new Error(error.message);

  const { data: existingReports, error: reportsError } = await supabase
    .from("reports")
    .select("slot_id")
    .eq("conducteur_id", userId);

  if (reportsError) throw new Error(reportsError.message);

  const reportedSlotIds = new Set(existingReports.map((r) => r.slot_id));

  return (slots as unknown as PendingSlot[]).filter((slot) => !reportedSlotIds.has(slot.id));
}

export async function createReport(
  slotId: string,
  conducteurId: string,
  values: ReportFormValues,
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("reports").insert({
    slot_id: slotId,
    conducteur_id: conducteurId,
    attendees_count: values.attendees_count,
    topics_covered: values.topics_covered || null,
    content: values.content,
    follow_up: values.follow_up || null,
  });

  if (error) throw new Error(error.message);
}

export async function updateReport(id: string, values: ReportFormValues): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("reports")
    .update({
      attendees_count: values.attendees_count,
      topics_covered: values.topics_covered || null,
      content: values.content,
      follow_up: values.follow_up || null,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function deleteReport(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("reports").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
