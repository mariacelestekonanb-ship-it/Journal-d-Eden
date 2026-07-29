import { MemberService } from "../services/member.service";
import type { Member } from "../types/member.types";

export async function updateOwnProfileAction(id: string, values: { phone: string }, photo?: File): Promise<Member> {
  return MemberService.updateOwnProfile(id, values, photo);
}
