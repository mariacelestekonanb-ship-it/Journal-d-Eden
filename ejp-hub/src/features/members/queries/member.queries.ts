import { createClient } from "@/shared/lib/supabase/client";
import type { MemberStatus, PlanningStatus, ReportStatus, UserRole } from "@/shared/types/database";

/**
 * Requêtes Supabase brutes du module Membres, exécutables depuis le
 * navigateur (clé `anon`, soumises à la RLS). Ce fichier est le seul à
 * connaître le schéma de `profiles` pour la lecture et les mutations
 * courantes — jamais appelé depuis un composant (voir
 * `repositories/member-repository.ts`).
 *
 * Les deux opérations qui nécessitent la clé de service (création d'un
 * compte lors d'une demande d'adhésion, changement d'e-mail par un admin)
 * vivent à part, dans `queries/member-admin.queries.ts` (`server-only`),
 * jamais importé ici ni depuis un composant client.
 */

export interface RawMemberProfile {
  id: string;
  firstname: string;
  lastname: string;
}

export interface RawMemberRow {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  status: MemberStatus;
  is_active: boolean;
  validated_at: string | null;
  validated_by: string | null;
  /** Résolu séparément (voir `queryMemberById`) — jamais via un embed PostgREST, voir le commentaire de `MEMBER_SELECT`. */
  validator: RawMemberProfile | null;
  created_at: string;
  updated_at: string;
}

export interface RawMemberAssignmentRow {
  id: string;
  title: string;
  slot_date: string;
  start_time: string;
  end_time: string;
  status: PlanningStatus;
}

export interface RawMemberReportRow {
  id: string;
  status: ReportStatus;
  created_at: string;
  planning: { title: string; slot_date: string } | null;
}

/**
 * `validated_by` reste une colonne brute ici : l'embed PostgREST auto-référencé
 * (`profiles!profiles_validated_by_fkey`) s'est révélé indisponible en
 * production sur ce projet Supabase (« Could not find a relationship between
 * 'profiles' and 'profiles' in the schema cache », persistant même après
 * rechargement du cache et redémarrage du projet) — il bloquait la moindre
 * lecture de `profiles`, donc tout le module Membres. Le nom du validateur
 * est résolu par une requête séparée, seulement là où il est affiché (voir
 * `queryMemberById`).
 */
const MEMBER_SELECT = `
  id, firstname, lastname, email, phone, avatar_url, role, status, is_active, validated_at, validated_by,
  created_at, updated_at
`;

export async function queryAllMembers(): Promise<RawMemberRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("profiles").select(MEMBER_SELECT).order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as Omit<RawMemberRow, "validator">[]).map((row) => ({ ...row, validator: null }));
}

export async function queryMemberById(id: string): Promise<RawMemberRow | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from("profiles").select(MEMBER_SELECT).eq("id", id).maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  const row = data as unknown as Omit<RawMemberRow, "validator">;
  if (!row.validated_by) return { ...row, validator: null };

  const { data: validator } = await supabase
    .from("profiles")
    .select("id, firstname, lastname")
    .eq("id", row.validated_by)
    .maybeSingle();

  return { ...row, validator: (validator as RawMemberProfile | null) ?? null };
}

/**
 * Met à jour statut + `is_active` ensemble (invariant `ACTIVE ⇔ is_active`
 * tenu applicativement, voir `DATABASE.md#profiles`), et `validated_at`/
 * `validated_by` lors d'une acceptation ou d'un refus.
 */
export async function updateMemberStatusQuery(
  id: string,
  fields: { status: MemberStatus; isActive: boolean; validatedBy?: string; role?: UserRole },
): Promise<RawMemberRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update({
      status: fields.status,
      is_active: fields.isActive,
      ...(fields.validatedBy !== undefined ? { validated_at: new Date().toISOString(), validated_by: fields.validatedBy } : {}),
      ...(fields.role !== undefined ? { role: fields.role } : {}),
    })
    .eq("id", id)
    .select(MEMBER_SELECT)
    .single();

  if (error) throw new Error(error.message);
  return { ...(data as unknown as Omit<RawMemberRow, "validator">), validator: null };
}

export async function updateMemberRoleQuery(id: string, role: UserRole): Promise<RawMemberRow> {
  const supabase = createClient();
  const { data, error } = await supabase.from("profiles").update({ role }).eq("id", id).select(MEMBER_SELECT).single();

  if (error) throw new Error(error.message);
  return { ...(data as unknown as Omit<RawMemberRow, "validator">), validator: null };
}

export async function updateOwnMemberProfileQuery(
  id: string,
  fields: { phone: string; avatarUrl?: string },
): Promise<RawMemberRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update({ phone: fields.phone, ...(fields.avatarUrl !== undefined ? { avatar_url: fields.avatarUrl } : {}) })
    .eq("id", id)
    .select(MEMBER_SELECT)
    .single();

  if (error) throw new Error(error.message);
  return { ...(data as unknown as Omit<RawMemberRow, "validator">), validator: null };
}

/** Upload de la photo de profil — chemin `avatars/<user_id>/<fichier>`, cohérent avec la policy `avatars_owner_write`. */
export async function uploadOwnAvatarQuery(userId: string, file: File): Promise<string> {
  const supabase = createClient();
  const path = `${userId}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
  if (uploadError) throw new Error(uploadError.message);

  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  return data.publicUrl;
}

export async function queryMemberAssignments(memberId: string): Promise<RawMemberAssignmentRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("planning")
    .select("id, title, slot_date, start_time, end_time, status")
    .or(`prayer_leader_id.eq.${memberId},secondary_leader_id.eq.${memberId}`)
    .order("slot_date", { ascending: false });

  if (error) throw new Error(error.message);
  return data as unknown as RawMemberAssignmentRow[];
}

export async function queryMemberReports(memberId: string): Promise<RawMemberReportRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("reports")
    .select("id, status, created_at, planning:planning(title, slot_date)")
    .eq("created_by", memberId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as unknown as RawMemberReportRow[];
}
