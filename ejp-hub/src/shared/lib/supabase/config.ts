/**
 * Indique si un projet Supabase est réellement configuré (variables
 * d'environnement renseignées). Permet au middleware et au layout connecté
 * de retomber sur un mode démo (voir `shared/constants/mock-profile.ts`)
 * tant qu'aucun projet Supabase n'est branché, sans planter l'application.
 *
 * Utilisable côté serveur comme côté client : seules les variables
 * `NEXT_PUBLIC_*` sont nécessaires pour cette vérification.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
