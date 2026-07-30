"use server";

import { isSupabaseConfigured } from "@/shared/lib/supabase/config";

import { MemberMapper } from "../mappers/member.mapper";
import { adminCreateMembershipRequestQuery, adminUploadAvatarQuery } from "../queries/member-admin.queries";
import type { Member } from "../types/member.types";
import type { MemberJoinFormValues } from "../validation/member-join.schema";

export type CreateMembershipRequestResult = { success: true; member: Member } | { success: false; message: string };

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
 *
 * Retourne un résultat typé plutôt que de laisser remonter une exception :
 * Next.js remplace le message des erreurs qui traversent la frontière d'une
 * Server Action par un message générique en production (sécurité par
 * défaut), ce qui rendrait illisibles des erreurs pourtant destinées à
 * l'utilisateur (ex. « cette adresse e-mail est déjà utilisée »).
 */
export async function createMembershipRequestAction(
  values: Omit<MemberJoinFormValues, "photo">,
  photo?: File,
): Promise<CreateMembershipRequestResult> {
  if (!isSupabaseConfigured()) {
    const now = new Date().toISOString();
    // Pas de stockage réel disponible côté serveur en mode démo — la photo
    // éventuelle n'est pas prévisualisable ici (voir le commentaire de tête).
    return {
      success: true,
      member: {
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
      },
    };
  }

  try {
    const row = await adminCreateMembershipRequestQuery(values);
    if (photo) {
      const avatarUrl = await adminUploadAvatarQuery(row.id, photo);
      return { success: true, member: { ...MemberMapper.toMember(row), photoUrl: avatarUrl } };
    }
    return { success: true, member: MemberMapper.toMember(row) };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Impossible d'envoyer la demande." };
  }
}
