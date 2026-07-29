import { MemberService } from "../services/member.service";
import type { Member } from "../types/member.types";

export async function suspendMemberAction(id: string, adminId: string): Promise<Member> {
  return MemberService.suspend(id, adminId);
}
