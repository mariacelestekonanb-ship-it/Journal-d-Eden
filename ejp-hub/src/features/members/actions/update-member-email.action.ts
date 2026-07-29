"use server";

import { requireRole } from "@/shared/lib/auth/guards";
import { isSupabaseConfigured } from "@/shared/lib/supabase/config";

import { MemberMapper } from "../mappers/member.mapper";
import { adminUpdateMemberEmailQuery } from "../queries/member-admin.queries";
import type { Member } from "../types/member.types";

/**
 * Changement d'e-mail réservé à un administrateur — nécessite la clé de
 * service pour rester synchronisé avec `auth.users.email` (voir
 * `queries/member-admin.queries.ts`), donc une vraie Server Action. Le garde
 * serveur `requireRole` est une protection supplémentaire : le middleware et
 * la RLS restent les premières lignes de défense (voir `AUTHENTICATION.md`).
 */
export async function updateMemberEmailAction(memberId: string, email: string): Promise<Member> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase n'est pas encore configuré pour ce projet. Voir SUPABASE_SETUP.md.");
  }

  await requireRole(["ADMIN"]);

  const row = await adminUpdateMemberEmailQuery(memberId, email);
  return MemberMapper.toMember(row);
}
