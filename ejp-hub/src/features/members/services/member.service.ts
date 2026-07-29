import { isSupabaseConfigured } from "@/shared/lib/supabase/config";

import { MockMemberRepository } from "../repositories/mock-member-repository";
import type { MemberListContext, MemberRepository } from "../repositories/member-repository";
import { SupabaseMemberRepository } from "../repositories/supabase-member-repository";
import type { Member, MemberAssignmentSummary, MemberReportSummary, MemberRole } from "../types/member.types";
import { MemberValidationService } from "./member-validation.service";

/**
 * Point d'entrée unique pour toute donnée des Membres (hors création de
 * demande d'adhésion et changement d'e-mail — voir les Server Actions
 * dédiées). Les composants et hooks ne connaissent que cette interface —
 * jamais `MemberRepository`, `member.queries.ts` ni le client Supabase
 * directement.
 */
function getRepository(): MemberRepository {
  return isSupabaseConfigured() ? SupabaseMemberRepository : MockMemberRepository;
}

export const MemberService = {
  async list(context: MemberListContext): Promise<Member[]> {
    return getRepository().list(context);
  },

  async getById(id: string, context: MemberListContext): Promise<Member | null> {
    return getRepository().getById(id, context);
  },

  async accept(id: string, adminId: string): Promise<Member> {
    return getRepository().accept(id, adminId);
  },

  async refuse(id: string, adminId: string): Promise<Member> {
    return getRepository().refuse(id, adminId);
  },

  async suspend(id: string, adminId: string): Promise<Member> {
    MemberValidationService.assertNotSelf(adminId, id, "suspendre");
    return getRepository().suspend(id);
  },

  async reactivate(id: string): Promise<Member> {
    return getRepository().reactivate(id);
  },

  async changeRole(id: string, role: MemberRole, adminId: string): Promise<Member> {
    MemberValidationService.assertNotSelf(adminId, id, "modifier le rôle de");
    return getRepository().changeRole(id, role);
  },

  async updateOwnProfile(id: string, values: { phone: string }, photo?: File): Promise<Member> {
    return getRepository().updateOwnProfile(id, values, photo);
  },

  async listAssignments(memberId: string): Promise<MemberAssignmentSummary[]> {
    return getRepository().listAssignments(memberId);
  },

  async listReports(memberId: string): Promise<MemberReportSummary[]> {
    return getRepository().listReports(memberId);
  },
};
