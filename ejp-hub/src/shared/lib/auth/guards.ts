import "server-only";

import { redirect } from "next/navigation";

import { ROUTES } from "@/shared/constants/app";
import type { Role } from "@/shared/constants/roles";

import { getCurrentProfile, type CurrentProfile } from "./get-current-profile";

/**
 * Garde-fous serveur pour les Server Components / Server Actions. Ce sont
 * des filets de sécurité en complément du middleware (qui reste la
 * première ligne de défense) et de la Row Level Security Postgres (qui
 * reste la dernière) — jamais un remplacement de l'un ou de l'autre.
 */

/** Lève une exception si personne n'est connecté (à utiliser dans une Server Action). */
export async function requireProfile(): Promise<CurrentProfile> {
  const profile = await getCurrentProfile();
  if (!profile) {
    throw new Error("Utilisateur non authentifié.");
  }
  return profile;
}

/** Lève une exception si le rôle courant n'est pas autorisé (à utiliser dans une Server Action). */
export async function requireRole(allowed: Role[]): Promise<CurrentProfile> {
  const profile = await requireProfile();
  if (!allowed.includes(profile.role)) {
    throw new Error("Action non autorisée pour ce rôle.");
  }
  return profile;
}

/** Redirige vers /connexion si personne n'est connecté (à utiliser dans un layout/page). */
export async function redirectIfUnauthenticated(): Promise<CurrentProfile> {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect(ROUTES.login);
  }
  return profile;
}

/** Redirige vers le tableau de bord si le rôle courant n'est pas autorisé. */
export async function redirectIfMissingRole(allowed: Role[]): Promise<CurrentProfile> {
  const profile = await redirectIfUnauthenticated();
  if (!allowed.includes(profile.role)) {
    redirect(ROUTES.dashboard);
  }
  return profile;
}
