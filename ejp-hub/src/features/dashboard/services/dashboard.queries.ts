import { endOfWeek, startOfWeek } from "date-fns";

import { createClient } from "@/shared/lib/supabase/client";
import type { NotificationType, TopicPriority } from "@/shared/types/database";

/**
 * Requêtes Supabase brutes du module Dashboard. Volontairement séparées du
 * service (`dashboard.service.ts`) : ce fichier ne connaît que le schéma de
 * la base de données, jamais les types applicatifs exposés aux composants
 * (voir `dashboard.mapper.ts` pour la conversion).
 */

export interface RawUpcomingSlotRow {
  id: string;
  slot_date: string;
  start_time: string;
  end_time: string;
  location: string | null;
  prayer_topic: { title: string } | null;
  prayer_leader: { firstname: string; lastname: string } | null;
}

export interface RawPrayerTopicRow {
  id: string;
  title: string;
  priority: TopicPriority;
  created_at: string;
  author: { firstname: string; lastname: string } | null;
}

export interface RawNotificationRow {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  created_at: string;
  read_at: string | null;
}

export interface RawActivityRow {
  id: string;
  actor: { firstname: string; lastname: string } | null;
  timestamp: string;
}

const UPCOMING_SLOT_SELECT =
  "id, slot_date, start_time, end_time, location, prayer_topic:prayer_topics(title), prayer_leader:profiles(firstname, lastname)";

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function queryPrayerLeadersCount(): Promise<number> {
  const supabase = createClient();
  const { count, error } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "PRAYER_LEADER");

  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function queryActiveTopicsCount(): Promise<number> {
  const supabase = createClient();
  const { count, error } = await supabase
    .from("prayer_topics")
    .select("*", { count: "exact", head: true })
    .eq("status", "ACTIVE");

  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function queryPublishedTestimoniesCount(): Promise<number> {
  const supabase = createClient();
  const { count, error } = await supabase.from("testimonies").select("*", { count: "exact", head: true });

  if (error) throw new Error(error.message);
  return count ?? 0;
}

/** Créneaux passés sans compte rendu, éventuellement restreints à un conducteur. */
export async function queryPendingReportsCount(prayerLeaderId?: string): Promise<number> {
  const supabase = createClient();
  let slotsQuery = supabase
    .from("planning")
    .select("id")
    .lte("slot_date", todayIsoDate())
    .not("prayer_leader_id", "is", null);

  if (prayerLeaderId) {
    slotsQuery = slotsQuery.eq("prayer_leader_id", prayerLeaderId);
  }

  const { data: slots, error: slotsError } = await slotsQuery;
  if (slotsError) throw new Error(slotsError.message);
  if (slots.length === 0) return 0;

  const slotIds = slots.map((slot) => slot.id);
  const { data: reports, error: reportsError } = await supabase
    .from("reports")
    .select("planning_id")
    .in("planning_id", slotIds);

  if (reportsError) throw new Error(reportsError.message);

  const reportedIds = new Set(reports.map((report) => report.planning_id));
  return slotIds.filter((id) => !reportedIds.has(id)).length;
}

export async function queryMySlotsThisWeekCount(prayerLeaderId: string): Promise<number> {
  const supabase = createClient();
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 }).toISOString().slice(0, 10);
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 }).toISOString().slice(0, 10);

  const { count, error } = await supabase
    .from("planning")
    .select("*", { count: "exact", head: true })
    .eq("prayer_leader_id", prayerLeaderId)
    .gte("slot_date", weekStart)
    .lte("slot_date", weekEnd);

  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function queryMyUpcomingSlotsCount(prayerLeaderId: string): Promise<number> {
  const supabase = createClient();
  const { count, error } = await supabase
    .from("planning")
    .select("*", { count: "exact", head: true })
    .eq("prayer_leader_id", prayerLeaderId)
    .gte("slot_date", todayIsoDate());

  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function queryMyUnreadNotificationsCount(userId: string): Promise<number> {
  const supabase = createClient();
  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .is("read_at", null);

  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function queryUpcomingSlots(options: {
  prayerLeaderId?: string;
  limit: number;
}): Promise<RawUpcomingSlotRow[]> {
  const supabase = createClient();
  let query = supabase
    .from("planning")
    .select(UPCOMING_SLOT_SELECT)
    .gte("slot_date", todayIsoDate())
    .order("slot_date", { ascending: true })
    .order("start_time", { ascending: true })
    .limit(options.limit);

  if (options.prayerLeaderId) {
    query = query.eq("prayer_leader_id", options.prayerLeaderId);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data as unknown as RawUpcomingSlotRow[];
}

export async function queryRecentPrayerTopics(limit: number): Promise<RawPrayerTopicRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("prayer_topics")
    .select("id, title, priority, created_at, author:profiles(firstname, lastname)")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data as unknown as RawPrayerTopicRow[];
}

export async function queryNotifications(userId: string, limit: number): Promise<RawNotificationRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("notifications")
    .select("id, type, title, message, created_at, read_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data;
}

export async function markNotificationReadQuery(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function markAllNotificationsReadQuery(userId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", userId)
    .is("read_at", null);

  if (error) throw new Error(error.message);
}

/** Activité récente dérivée de trois tables existantes — aucune table dédiée n'est nécessaire. */
export async function queryRecentActivityRows(limit: number): Promise<{
  reports: RawActivityRow[];
  testimonies: RawActivityRow[];
  topics: RawActivityRow[];
}> {
  const supabase = createClient();

  const [reportsResult, testimoniesResult, topicsResult] = await Promise.all([
    supabase
      .from("reports")
      .select("id, submitted_at, actor:profiles(firstname, lastname)")
      .order("submitted_at", { ascending: false })
      .limit(limit),
    supabase
      .from("testimonies")
      .select("id, created_at, actor:profiles(firstname, lastname)")
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .from("prayer_topics")
      .select("id, created_at, actor:profiles(firstname, lastname)")
      .order("created_at", { ascending: false })
      .limit(limit),
  ]);

  if (reportsResult.error) throw new Error(reportsResult.error.message);
  if (testimoniesResult.error) throw new Error(testimoniesResult.error.message);
  if (topicsResult.error) throw new Error(topicsResult.error.message);

  const toActivityRow = (row: { id: string; actor: { firstname: string; lastname: string } | null }, ts: string) => ({
    id: row.id,
    actor: row.actor,
    timestamp: ts,
  });

  return {
    reports: reportsResult.data.map((row) => toActivityRow(row, row.submitted_at)),
    testimonies: testimoniesResult.data.map((row) => toActivityRow(row, row.created_at)),
    topics: topicsResult.data.map((row) => toActivityRow(row, row.created_at)),
  };
}
