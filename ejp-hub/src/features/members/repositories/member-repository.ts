import type { Role } from "@/shared/constants/roles";

import type { Member, MemberAssignmentSummary, MemberReportSummary, MemberRole } from "../types/member.types";

/** Contexte du visiteur courant — nécessaire pour appliquer l'isolation stricte (un conducteur ne voit que son propre profil). */
export interface MemberListContext {
  userId: string;
  role: Role;
}

/**
 * Contrat d'accès aux données des Membres, indépendant de la source réelle.
 * `MemberService` ne dépend que de cette interface — jamais d'une
 * implémentation concrète — pour que brancher Supabase se limite à changer
 * `getRepository()` (voir plus bas), sans toucher au reste du module.
 *
 * La création d'une demande d'adhésion et le changement d'e-mail par un
 * admin n'apparaissent pas ici : ce sont les deux seules opérations du
 * module qui nécessitent la clé de service Supabase, isolées dans des
 * Server Actions dédiées (`actions/create-membership-request.action.ts`,
 * `actions/update-member-email.action.ts`) pour que ce fichier — importé
 * par des hooks client — reste sans dépendance `server-only`.
 */
export interface MemberRepository {
  list(context: MemberListContext): Promise<Member[]>;
  getById(id: string, context: MemberListContext): Promise<Member | null>;
  accept(id: string, adminId: string): Promise<Member>;
  refuse(id: string, adminId: string): Promise<Member>;
  suspend(id: string): Promise<Member>;
  reactivate(id: string): Promise<Member>;
  changeRole(id: string, role: MemberRole): Promise<Member>;
  updateOwnProfile(id: string, values: { phone: string }, photo?: File): Promise<Member>;
  listAssignments(memberId: string): Promise<MemberAssignmentSummary[]>;
  listReports(memberId: string): Promise<MemberReportSummary[]>;
}
