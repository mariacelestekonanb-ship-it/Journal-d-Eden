import { createClient } from "@/lib/supabase/client";
import type { PlanningSlotWithRelations } from "@/features/planning/types/planning.types";
import type { TestimonyWithAuthor } from "@/features/testimonies/types/testimony.types";

const SLOT_SELECT = "*, conducteur:profiles(id, full_name), topic:prayer_topics(id, title)";

export async function getUpcomingSlots(userId: string, isAdmin: boolean): Promise<PlanningSlotWithRelations[]> {
  const supabase = createClient();
  const today = new Date().toISOString().slice(0, 10);

  let query = supabase
    .from("planning_slots")
    .select(SLOT_SELECT)
    .gte("slot_date", today)
    .order("slot_date", { ascending: true })
    .order("start_time", { ascending: true })
    .limit(5);

  if (!isAdmin) {
    query = query.eq("conducteur_id", userId);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data as unknown as PlanningSlotWithRelations[];
}

export async function getActiveTopicsCount(): Promise<number> {
  const supabase = createClient();
  const { count, error } = await supabase
    .from("prayer_topics")
    .select("*", { count: "exact", head: true })
    .eq("status", "actif");

  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function getPendingReportsCount(userId: string, isAdmin: boolean): Promise<number> {
  const supabase = createClient();
  const today = new Date().toISOString().slice(0, 10);

  let slotsQuery = supabase
    .from("planning_slots")
    .select("id")
    .lte("slot_date", today)
    .not("conducteur_id", "is", null);

  if (!isAdmin) {
    slotsQuery = slotsQuery.eq("conducteur_id", userId);
  }

  const { data: slots, error: slotsError } = await slotsQuery;
  if (slotsError) throw new Error(slotsError.message);
  if (slots.length === 0) return 0;

  const slotIds = slots.map((slot) => slot.id);
  const { data: reports, error: reportsError } = await supabase
    .from("reports")
    .select("slot_id")
    .in("slot_id", slotIds);

  if (reportsError) throw new Error(reportsError.message);

  const reportedIds = new Set(reports.map((report) => report.slot_id));
  return slotIds.filter((id) => !reportedIds.has(id)).length;
}

export async function getRecentTestimonies(): Promise<TestimonyWithAuthor[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("testimonies")
    .select("*, author:profiles(id, full_name, avatar_url)")
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) throw new Error(error.message);
  return data as unknown as TestimonyWithAuthor[];
}
