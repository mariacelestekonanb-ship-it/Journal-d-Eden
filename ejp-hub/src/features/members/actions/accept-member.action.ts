import { MemberService } from "../services/member.service";
import type { Member } from "../types/member.types";

export async function acceptMemberAction(id: string, adminId: string): Promise<Member> {
  return MemberService.accept(id, adminId);
}
