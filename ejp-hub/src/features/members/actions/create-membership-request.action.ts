"use server";

import { isSupabaseConfigured } from "@/shared/lib/supabase/config";

import { MemberMapper } from "../mappers/member.mapper";
import { adminCreateMembershipRequestQuery, adminUploadAvatarQuery } from "../queries/member-admin.queries";
import type { Member } from "../types/member.types";
import type { MemberJoinFormValues } from "../validation/member-join.schema";

/**
 * Seule opération du module accessible sans authentification : crée le
 * compte d'une demande d'adhésion (voir `queries/member-admin.queries.ts`
 * pour pourquoi cela nécessite la clé de service, donc une vraie Server
 * Action plutôt qu'un simple appel client comme le reste du module).
 *
 * En mode démo (Supabase non configuré), il n'existe aucun backend réel
 * pouvant recevoir ce compte : la demande est simulée (retour d'un membre
 * fictif) pour que le formulaire reste testable, mais n'apparaît pas dans la
 * liste admin (mémoire du navigateur, non partagée avec le serveur) — une
 * limitation du mode démo, documentée dans MEMBERS.md.
 */
export async function createMembershipRequestAction(
  values: Omit<MemberJoinFormValues, "photo">,
  photo?: File,
): Promise<Member> {
  if (!isSupabaseConfigured()) {
    const now = new Date().toISOString();
    // Pas de stockage réel disponible côté serveur en mode démo — la photo
    // éventuelle n'est pas prévisualisable ici (voir le commentaire de tête).
    return {
      id: `demo-${Date.now()}`,
      firstName: values.firstName,
      lastName: values.lastName,
      fullName: `${values.firstName} ${values.lastName}`.trim(),
      email: values.email,
      phone: values.phone,
      photoUrl: null,
      role: "PRAYER_LEADER",
      status: "PENDING",
      registeredAt: now,
      validatedAt: null,
      validatedBy: null,
      createdAt: now,
      updatedAt: now,
    };
  }

  const row = await adminCreateMembershipRequestQuery(values);
  if (photo) {
    const avatarUrl = await adminUploadAvatarQuery(row.id, photo);
    return { ...MemberMapper.toMember(row), photoUrl: avatarUrl };
  }
  return MemberMapper.toMember(row);
}
