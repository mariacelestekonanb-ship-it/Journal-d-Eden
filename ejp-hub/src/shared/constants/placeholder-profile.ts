import type { CurrentProfile } from "@/shared/lib/auth/get-current-profile";

/**
 * Profil affiché tant qu'aucune session Supabase réelle n'est active.
 * Permet de visualiser le shell (sidebar, header) sans configurer
 * Supabase — à retirer dès que l'authentification est branchée (Sprint 2).
 */
export const PLACEHOLDER_PROFILE: CurrentProfile = {
  id: "placeholder",
  full_name: "Utilisateur EJP",
  email: "utilisateur@ejp-hub.org",
  phone: null,
  avatar_url: null,
  role: "admin",
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};
