import { createClient } from "@/shared/lib/supabase/client";
import type { PlanningLeaderRole, ReplacementRequestStatus } from "@/shared/types/database";

/**
 * Requêtes Supabase brutes des demandes de remplacement — voir
 * `services/replacement-request-repository.ts`, jamais appelé directement
 * depuis un composant.
 */

export interface RawReplacementRequestProfile {
  id: string;
  firstname: string;
  lastname: string;
}

export interface RawReplacementRequestRow {
  id: string;
  planning_id: string;
  role: PlanningLeaderRole;
  comment: string | null;
  status: ReplacementRequestStatus;
  created_at: string;
  decided_at: string | null;
  requested_by: RawReplacementRequestProfile;
  proposed_member: RawReplacementRequestProfile;
}

const REPLACEMENT_REQUEST_SELECT = `
  id, planning_id, role, comment, status, created_at, decided_at,
  requested_by:profiles!planning_replacement_requests_requested_by_fkey(id, firstname, lastname),
  proposed_member:profiles!planning_replacement_requests_proposed_member_id_fkey(id, firstname, lastname)
`;

export async function queryReplacementRequestsForSlot(planningId: string): Promise<RawReplacementRequestRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("planning_replacement_requests")
    .select(REPLACEMENT_REQUEST_SELECT)
    .eq("planning_id", planningId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as unknown as RawReplacementRequestRow[];
}

export async function createReplacementRequestQuery(input: {
  planningId: string;
  role: PlanningLeaderRole;
  requestedBy: string;
  proposedMemberId: string;
  comment: string | null;
}): Promise<RawReplacementRequestRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("planning_replacement_requests")
    .insert({
      planning_id: input.planningId,
      role: input.role,
      requested_by: input.requestedBy,
      proposed_member_id: input.proposedMemberId,
      comment: input.comment,
    })
    .select(REPLACEMENT_REQUEST_SELECT)
    .single();

  if (error) throw new Error(error.message);
  return data as unknown as RawReplacementRequestRow;
}

export async function decideReplacementRequestQuery(
  id: string,
  decision: "APPROVED" | "REJECTED",
  decidedBy: string,
): Promise<RawReplacementRequestRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("planning_replacement_requests")
    .update({ status: decision, decided_at: new Date().toISOString(), decided_by: decidedBy })
    .eq("id", id)
    .select(REPLACEMENT_REQUEST_SELECT)
    .single();

  if (error) throw new Error(error.message);
  return data as unknown as RawReplacementRequestRow;
}

export async function cancelReplacementRequestQuery(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("planning_replacement_requests").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
