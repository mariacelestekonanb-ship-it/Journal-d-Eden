import { MemberMapper } from "../mappers/member.mapper";
import {
  queryAllMembers,
  queryMemberAssignments,
  queryMemberById,
  queryMemberReports,
  updateMemberRoleQuery,
  updateMemberStatusQuery,
  updateOwnMemberProfileQuery,
  uploadOwnAvatarQuery,
} from "../queries/member.queries";
import type { MemberRepository } from "./member-repository";

/**
 * Implémentation réelle de `MemberRepository`, branchée sur Supabase via la
 * clé `anon` (soumise à la RLS). Utilisée dès que `isSupabaseConfigured()`
 * renvoie `true` (voir `getRepository()` dans `member.service.ts`).
 *
 * Les transitions de statut (`accept`/`refuse`/`suspend`/`reactivate`) et le
 * changement de rôle passent tous par `updateMemberStatusQuery`/
 * `updateMemberRoleQuery` — un administrateur authentifié les traverse sans
 * problème (RLS `profiles_update_self_or_admin` + `prevent_privilege_escalation`
 * autorisent explicitement un acteur `ADMIN`, voir `DATABASE.md#profiles`).
 * Aucune de ces opérations ne nécessite la clé de service.
 */
export const SupabaseMemberRepository: MemberRepository = {
  async list() {
    const rows = await queryAllMembers();
    return rows.map(MemberMapper.toMember);
  },

  async getById(id) {
    const row = await queryMemberById(id);
    return row ? MemberMapper.toMember(row) : null;
  },

  async accept(id, adminId) {
    const row = await updateMemberStatusQuery(id, { status: "ACTIVE", isActive: true, validatedBy: adminId, role: "PRAYER_LEADER" });
    return MemberMapper.toMember(row);
  },

  async refuse(id, adminId) {
    const row = await updateMemberStatusQuery(id, { status: "REFUSED", isActive: false, validatedBy: adminId });
    return MemberMapper.toMember(row);
  },

  async suspend(id) {
    const row = await updateMemberStatusQuery(id, { status: "SUSPENDED", isActive: false });
    return MemberMapper.toMember(row);
  },

  async reactivate(id) {
    const row = await updateMemberStatusQuery(id, { status: "ACTIVE", isActive: true });
    return MemberMapper.toMember(row);
  },

  async changeRole(id, role) {
    const row = await updateMemberRoleQuery(id, role);
    return MemberMapper.toMember(row);
  },

  async updateOwnProfile(id, values, photo) {
    const avatarUrl = photo ? await uploadOwnAvatarQuery(id, photo) : undefined;
    const row = await updateOwnMemberProfileQuery(id, { phone: values.phone, avatarUrl });
    return MemberMapper.toMember(row);
  },

  async listAssignments(memberId) {
    const rows = await queryMemberAssignments(memberId);
    return rows.map(MemberMapper.toAssignmentSummary);
  },

  async listReports(memberId) {
    const rows = await queryMemberReports(memberId);
    return rows.map(MemberMapper.toReportSummary);
  },
};
