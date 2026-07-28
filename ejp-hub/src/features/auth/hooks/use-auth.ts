"use client";

import { useAuthContext, type AuthContextValue } from "../providers/auth-provider";

/** Session Supabase Auth courante (utilisateur, chargement, déconnexion). */
export function useAuth(): AuthContextValue {
  return useAuthContext();
}
