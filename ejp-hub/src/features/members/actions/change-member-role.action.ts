import { MemberService } from "../services/member.service";
import type { Member, MemberRole } from "../types/member.types";

export async function changeMemberRoleAction(id: string, role: MemberRole, adminId: string): Promise<Member> {
  return MemberService.changeRole(id, role, adminId);
}
