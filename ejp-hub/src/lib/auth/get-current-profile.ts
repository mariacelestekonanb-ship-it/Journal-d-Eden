import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type CurrentProfile = Database["public"]["Tables"]["profiles"]["Row"];

/** À utiliser depuis les Server Components / Server Actions uniquement. */
export async function getCurrentProfile(): Promise<CurrentProfile | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  return profile ?? null;
}

export async function requireProfile(): Promise<CurrentProfile> {
  const profile = await getCurrentProfile();
  if (!profile) {
    throw new Error("Utilisateur non authentifié.");
  }
  return profile;
}

export async function requireAdminProfile(): Promise<CurrentProfile> {
  const profile = await requireProfile();
  if (profile.role !== "admin") {
    throw new Error("Action réservée aux administrateurs.");
  }
  return profile;
}
