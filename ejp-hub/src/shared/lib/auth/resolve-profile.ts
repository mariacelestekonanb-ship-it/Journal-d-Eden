import "server-only";

import { MOCK_PROFILE } from "@/shared/constants/mock-profile";
import { isSupabaseConfigured } from "@/shared/lib/supabase/config";

import { getCurrentProfile, type CurrentProfile } from "./get-current-profile";

/**
 * Résout le profil à afficher pour une page du groupe (app) : le profil réel
 * si Supabase est configuré et l'utilisateur authentifié, sinon le profil de
 * démonstration (`MOCK_PROFILE`). N'effectue aucune redirection — cette
 * page est déjà protégée par `(app)/layout.tsx` (voir `guards.ts` pour la
 * version qui redirige).
 */
export async function resolveProfile(): Promise<CurrentProfile> {
  if (!isSupabaseConfigured()) {
    return MOCK_PROFILE;
  }

  const profile = await getCurrentProfile();
  return profile ?? MOCK_PROFILE;
}
