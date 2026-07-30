import "server-only";

import { createAdminClient } from "@/shared/lib/supabase/admin";

import type { RawMemberRow } from "./member.queries";

/**
 * Requêtes nécessitant la clé de service Supabase (`createAdminClient`,
 * contourne la RLS) — jamais importées depuis un composant client, jamais
 * depuis `member.queries.ts` (qui reste utilisable côté navigateur). Les
 * deux seules opérations du module qui en ont réellement besoin :
 *
 * - créer le compte d'une demande d'adhésion publique (l'API self-serve
 *   `supabase.auth.signUp` n'existe pas ici — l'inscription publique reste
 *   désactivée, voir `AUTHENTICATION.md` — c'est l'API Admin qui crée le
 *   compte, immédiatement marqué `PENDING`/inactif) ;
 * - changer l'e-mail de connexion d'un membre (réservé à un administrateur),
 *   qui doit rester synchronisé entre `auth.users.email` et `profiles.email`.
 *
 * Uniquement appelées depuis des Server Actions (`actions/*.action.ts`
 * marquées `"use server"`).
 */

/**
 * `validated_by` reste une colonne brute : voir le commentaire de
 * `MEMBER_SELECT` dans `member.queries.ts` (embed PostgREST auto-référencé
 * indisponible en production, cassait toute lecture de `profiles`).
 */
const MEMBER_SELECT = `
  id, firstname, lastname, email, phone, avatar_url, role, status, is_active, validated_at, validated_by,
  created_at, updated_at
`;

export interface MembershipRequestInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

/**
 * Crée le compte Supabase Auth d'une demande d'adhésion — `status: PENDING`
 * et `is_active: false` passés en `app_metadata` sont lus par le trigger
 * `handle_new_user` (voir `20260804090001_fix_privilege_escalation_signup.sql`),
 * qui crée le profil déjà dans cet état : le compte existe (mot de passe
 * haché par Supabase Auth) mais reste bloqué par le middleware tant qu'un
 * admin ne l'a pas validé (voir `middleware.ts` et `/compte-en-attente`).
 *
 * `role`/`status`/`is_active` passent volontairement par `app_metadata`
 * plutôt que `user_metadata` : seule l'API Admin (utilisée ici, clé de
 * service) peut écrire dans `app_metadata` — l'API publique `auth.signUp`
 * ne le peut jamais, contrairement à `user_metadata` qu'un appelant
 * quelconque peut renseigner librement. Voir le commentaire de la migration
 * pour le détail de la faille que ce choix ferme.
 */
export async function adminCreateMembershipRequestQuery(input: MembershipRequestInput): Promise<RawMemberRow> {
  const supabase = createAdminClient();

  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
    user_metadata: {
      firstname: input.firstName,
      lastname: input.lastName,
      phone: input.phone,
    },
    app_metadata: {
      role: "PRAYER_LEADER",
      status: "PENDING",
      is_active: false,
    },
  });

  if (createError) {
    throw new Error(
      createError.message.includes("already been registered")
        ? "Une demande ou un compte existe déjà avec cette adresse e-mail."
        : createError.message,
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(MEMBER_SELECT)
    .eq("id", created.user.id)
    .single();

  if (profileError) throw new Error(profileError.message);
  return { ...(profile as unknown as Omit<RawMemberRow, "validator">), validator: null };
}

/** Upload de la photo d'une demande d'adhésion — le compte vient d'être créé, aucune session utilisateur n'existe encore. */
export async function adminUploadAvatarQuery(userId: string, file: File): Promise<string> {
  const supabase = createAdminClient();
  const path = `${userId}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
  if (uploadError) throw new Error(uploadError.message);

  const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(path);

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: publicUrlData.publicUrl })
    .eq("id", userId);
  if (updateError) throw new Error(updateError.message);

  return publicUrlData.publicUrl;
}

/** Change l'e-mail de connexion réel (`auth.users.email`) puis le réplique sur `profiles.email`. */
export async function adminUpdateMemberEmailQuery(userId: string, email: string): Promise<RawMemberRow> {
  const supabase = createAdminClient();

  const { error: authError } = await supabase.auth.admin.updateUserById(userId, { email, email_confirm: true });
  if (authError) throw new Error(authError.message);

  const { data, error } = await supabase.from("profiles").update({ email }).eq("id", userId).select(MEMBER_SELECT).single();
  if (error) throw new Error(error.message);
  return { ...(data as unknown as Omit<RawMemberRow, "validator">), validator: null };
}
