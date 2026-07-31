import { MemberService } from "../services/member.service";
import type { Member } from "../types/member.types";

export async function restoreMemberAction(id: string): Promise<Member> {
  return MemberService.restore(id);
}
