import "server-only";

import { createClient } from "@/shared/lib/supabase/server";
import type { Database } from "@/shared/types/database";

export type CurrentProfile = Database["public"]["Tables"]["profiles"]["Row"];

/**
 * À utiliser depuis les Server Components / Server Actions uniquement.
 * Retourne `null` si personne n'est connecté, ou si Supabase n'est pas
 * encore configuré (variables d'environnement absentes).
 */
export async function getCurrentProfile(): Promise<CurrentProfile | null> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

    return profile ?? null;
  } catch {
    return null;
  }
}
