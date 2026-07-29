import { createClient } from "@/shared/lib/supabase/client";
import type { BibleReferenceJson, PrayerPointJson, ReportStatus } from "@/shared/types/database";

import type { ReportFormValues } from "../validation/report.schema";

/**
 * Requêtes Supabase brutes du module Comptes rendus. Ce fichier est le seul
 * à connaître le schéma de la table `reports` — jamais appelé depuis un
 * composant (voir `repositories/report-repository.ts`).
 *
 * `reports` a deux relations vers `profiles` (conducteur assigné et
 * auteur) : les alias d'embedding précisent la contrainte
 * (`!reports_..._fkey`) pour lever toute ambiguïté côté PostgREST.
 */

export interface RawReportProfile {
  id: string;
  firstname: string;
  lastname: string;
}

export interface RawReportSlot {
  id: string;
  title: string;
  slot_date: string;
  start_time: string;
  end_time: string;
  location: string | null;
}

export interface RawReportRow {
  id: string;
  session_date: string;
  session_start_time: string;
  session_end_time: string;
  connected_count: number | null;
  has_instrumental: boolean;
  thanksgiving: BibleReferenceJson[];
  holy_spirit_invitation: BibleReferenceJson[];
  prayer_points: PrayerPointJson[];
  closing_thanksgiving: BibleReferenceJson[];
  announcements: string | null;
  status: ReportStatus;
  created_at: string;
  updated_at: string;
  submitted_at: string | null;
  validated_at: string | null;
  planning: RawReportSlot | null;
  leader: RawReportProfile | null;
  author: RawReportProfile | null;
}

export interface RawReportComment {
  id: string;
  report_id: string;
  author_id: string;
  message: string;
  created_at: string;
  author: RawReportProfile | null;
}

const REPORT_SELECT = `
  id, session_date, session_start_time, session_end_time, connected_count, has_instrumental,
  thanksgiving, holy_spirit_invitation, prayer_points, closing_thanksgiving, announcements,
  status, created_at, updated_at, submitted_at, validated_at,
  planning:planning(id, title, slot_date, start_time, end_time, location),
  leader:profiles!reports_prayer_leader_id_fkey(id, firstname, lastname),
  author:profiles!reports_created_by_fkey(id, firstname, lastname)
`;

function toUpsertPayload(values: ReportFormValues) {
  return {
    session_date: values.generalInfo.date,
    session_start_time: values.generalInfo.startTime,
    session_end_time: values.generalInfo.endTime,
    connected_count: Number.isFinite(values.generalInfo.connectedCount) ? values.generalInfo.connectedCount : null,
    has_instrumental: values.generalInfo.hasInstrumental,
    thanksgiving: values.thanksgiving,
    holy_spirit_invitation: values.holySpiritInvitation,
    prayer_points: values.prayerPoints,
    closing_thanksgiving: values.closingThanksgiving,
    announcements: values.announcements || null,
  };
}

export async function queryAllReports(): Promise<RawReportRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("reports")
    .select(REPORT_SELECT)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as unknown as RawReportRow[];
}

export async function createReportQuery(
  values: ReportFormValues,
  planningId: string,
  leaderId: string,
  authorId: string,
): Promise<RawReportRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("reports")
    .insert({
      ...toUpsertPayload(values),
      planning_id: planningId,
      prayer_leader_id: leaderId,
      created_by: authorId,
    })
    .select(REPORT_SELECT)
    .single();

  if (error) throw new Error(error.message);
  return data as unknown as RawReportRow;
}

export async function updateReportQuery(id: string, values: ReportFormValues): Promise<RawReportRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("reports")
    .update(toUpsertPayload(values))
    .eq("id", id)
    .select(REPORT_SELECT)
    .single();

  if (error) throw new Error(error.message);
  return data as unknown as RawReportRow;
}

export async function updateReportStatusQuery(
  id: string,
  fields: { status: ReportStatus; submittedAt?: string | null; validatedAt?: string | null },
): Promise<RawReportRow> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("reports")
    .update({
      status: fields.status,
      ...(fields.submittedAt !== undefined ? { submitted_at: fields.submittedAt } : {}),
      ...(fields.validatedAt !== undefined ? { validated_at: fields.validatedAt } : {}),
    })
    .eq("id", id)
    .select(REPORT_SELECT)
    .single();

  if (error) throw new Error(error.message);
  return data as unknown as RawReportRow;
}

export async function deleteReportQuery(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("reports").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function queryAvailablePlanningSlots(): Promise<
  { id: string; title: string; slot_date: string; start_time: string; end_time: string; location: string | null; prayer_leader_id: string | null; leader: RawReportProfile | null }[]
> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("planning")
    .select("id, title, slot_date, start_time, end_time, location, prayer_leader_id, leader:profiles!planning_prayer_leader_id_fkey(id, firstname, lastname)")
    .not("id", "in", `(select planning_id from reports)`)
    .order("slot_date", { ascending: false });

  if (error) throw new Error(error.message);
  return data as unknown as {
    id: string;
    title: string;
    slot_date: string;
    start_time: string;
    end_time: string;
    location: string | null;
    prayer_leader_id: string | null;
    leader: RawReportProfile | null;
  }[];
}

export async function queryReportComments(reportId: string): Promise<RawReportComment[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("report_comments")
    .select("id, report_id, author_id, message, created_at, author:profiles(id, firstname, lastname)")
    .eq("report_id", reportId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data as unknown as RawReportComment[];
}

export async function createReportCommentQuery(
  reportId: string,
  authorId: string,
  message: string,
): Promise<RawReportComment> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("report_comments")
    .insert({ report_id: reportId, author_id: authorId, message })
    .select("id, report_id, author_id, message, created_at, author:profiles(id, firstname, lastname)")
    .single();

  if (error) throw new Error(error.message);
  return data as unknown as RawReportComment;
}
