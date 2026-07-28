import type { CurrentProfile } from "@/shared/lib/auth/get-current-profile";

/**
 * Profil de démonstration affiché uniquement quand Supabase n'est pas
 * configuré (`isSupabaseConfigured()` renvoie `false`) — permet de
 * consulter le shell de l'application (sidebar, header, pages) sans
 * provisionner de projet Supabase.
 *
 * Dès que Supabase est configuré, ce profil n'est plus jamais utilisé : un
 * visiteur non authentifié est alors réellement redirigé vers /connexion
 * (voir middleware.ts et shared/lib/auth/guards.ts).
 */
export const MOCK_PROFILE: CurrentProfile = {
  id: "mock-user",
  firstname: "Utilisateur",
  lastname: "Démo",
  email: "demo@ejp-hub.org",
  role: "ADMIN",
  avatar_url: null,
  phone: null,
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};
