import { MemberService } from "../services/member.service";
import type { Member } from "../types/member.types";

export async function reactivateMemberAction(id: string): Promise<Member> {
  return MemberService.reactivate(id);
}
