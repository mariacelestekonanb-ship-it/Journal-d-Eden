"use client";

import type { CurrentProfile } from "@/shared/lib/auth/get-current-profile";
import { createClient } from "@/shared/lib/supabase/client";
import { isSupabaseConfigured } from "@/shared/lib/supabase/config";

const NOT_CONFIGURED_MESSAGE =
  "Supabase n'est pas encore configuré pour ce projet. Voir SUPABASE_SETUP.md.";

function requireSupabaseConfigured(): void {
  if (!isSupabaseConfigured()) {
    throw new Error(NOT_CONFIGURED_MESSAGE);
  }
}

export async function signInWithPassword(email: string, password: string) {
  requireSupabaseConfigured();
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw new Error(
      error.message === "Invalid login credentials"
        ? "Adresse e-mail ou mot de passe incorrect."
        : error.message,
    );
  }
}

export async function requestPasswordReset(email: string) {
  requireSupabaseConfigured();
  const supabase = createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/callback?next=/reinitialiser-mot-de-passe`,
  });
  if (error) {
    throw new Error(error.message);
  }
}

export async function updatePassword(newPassword: string) {
  requireSupabaseConfigured();
  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) {
    throw new Error(error.message);
  }
}

export async function signOutClient() {
  if (!isSupabaseConfigured()) return;
  const supabase = createClient();
  await supabase.auth.signOut();
}

/** Utilisé par RoleProvider pour récupérer le profil applicatif de l'utilisateur connecté. */
export async function fetchProfileById(userId: string): Promise<CurrentProfile | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createClient();
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
  if (error) {
    return null;
  }
  return data;
}
