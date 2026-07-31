import { INITIAL_MOCK_MEMBERS, MOCK_MEMBER_ASSIGNMENTS, MOCK_MEMBER_REPORTS } from "../data/member.mocks";
import type { Member } from "../types/member.types";
import type { MemberListContext, MemberRepository } from "./member-repository";

/**
 * Implémentation en mémoire de `MemberRepository`, utilisée tant que
 * Supabase n'est pas configuré. L'état est mutable au niveau du module pour
 * que les actions (accepter, refuser, suspendre, réactiver, changer de
 * rôle, modifier son profil…) restent réellement interactives en mode démo.
 */
let members: Member[] = INITIAL_MOCK_MEMBERS.map((member) => ({ ...member }));

function requireMember(id: string): Member {
  const found = members.find((member) => member.id === id);
  if (!found) throw new Error("Membre introuvable.");
  return found;
}

/** Un conducteur ne voit jamais la fiche d'un autre membre — seul un admin voit tout. */
function isVisible(member: Member, context: MemberListContext): boolean {
  return context.role === "ADMIN" || member.id === context.userId;
}

function touch(member: Member): Member {
  return { ...member, updatedAt: new Date().toISOString() };
}

export const MockMemberRepository: MemberRepository = {
  async list(context) {
    return members.filter((member) => isVisible(member, context)).map((member) => ({ ...member }));
  },

  async getById(id, context) {
    const found = members.find((member) => member.id === id);
    if (!found || !isVisible(found, context)) return null;
    return { ...found };
  },

  async accept(id, adminId) {
    const existing = requireMember(id);
    const updated = touch({
      ...existing,
      status: "ACTIVE",
      role: "PRAYER_LEADER",
      validatedAt: new Date().toISOString(),
      validatedBy: { id: adminId, fullName: requireMember(adminId).fullName },
    });
    members = members.map((member) => (member.id === id ? updated : member));
    return updated;
  },

  async refuse(id, adminId) {
    const existing = requireMember(id);
    const updated = touch({
      ...existing,
      status: "REFUSED",
      validatedAt: new Date().toISOString(),
      validatedBy: { id: adminId, fullName: requireMember(adminId).fullName },
    });
    members = members.map((member) => (member.id === id ? updated : member));
    return updated;
  },

  async suspend(id) {
    const existing = requireMember(id);
    const updated = touch({ ...existing, status: "SUSPENDED" });
    members = members.map((member) => (member.id === id ? updated : member));
    return updated;
  },

  async reactivate(id) {
    const existing = requireMember(id);
    const updated = touch({ ...existing, status: "ACTIVE" });
    members = members.map((member) => (member.id === id ? updated : member));
    return updated;
  },

  async remove(id) {
    const existing = requireMember(id);
    const updated = touch({ ...existing, deletedAt: new Date().toISOString() });
    members = members.map((member) => (member.id === id ? updated : member));
    return updated;
  },

  async restore(id) {
    const existing = requireMember(id);
    const updated = touch({ ...existing, deletedAt: null });
    members = members.map((member) => (member.id === id ? updated : member));
    return updated;
  },

  async changeRole(id, role) {
    const existing = requireMember(id);
    const updated = touch({ ...existing, role });
    members = members.map((member) => (member.id === id ? updated : member));
    return updated;
  },

  async updateOwnProfile(id, values, photo) {
    const existing = requireMember(id);
    const updated = touch({
      ...existing,
      phone: values.phone,
      photoUrl: photo ? URL.createObjectURL(photo) : existing.photoUrl,
    });
    members = members.map((member) => (member.id === id ? updated : member));
    return updated;
  },

  async listAssignments(memberId) {
    return (MOCK_MEMBER_ASSIGNMENTS[memberId] ?? []).map((assignment) => ({ ...assignment }));
  },

  async listReports(memberId) {
    return (MOCK_MEMBER_REPORTS[memberId] ?? []).map((report) => ({ ...report }));
  },
};
