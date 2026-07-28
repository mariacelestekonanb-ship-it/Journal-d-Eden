"use client";

import { createClient } from "@/lib/supabase/client";

export async function signInWithPassword(email: string, password: string) {
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
  const supabase = createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/callback?next=/mon-profil`,
  });
  if (error) {
    throw new Error(error.message);
  }
}

export async function signOutClient() {
  const supabase = createClient();
  await supabase.auth.signOut();
}
