import { MemberService } from "../services/member.service";
import type { Member } from "../types/member.types";

export async function refuseMemberAction(id: string, adminId: string): Promise<Member> {
  return MemberService.refuse(id, adminId);
}
