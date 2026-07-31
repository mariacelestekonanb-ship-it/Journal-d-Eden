import { MemberService } from "../services/member.service";
import type { Member } from "../types/member.types";

export async function deleteMemberAction(id: string, adminId: string): Promise<Member> {
  return MemberService.remove(id, adminId);
}
