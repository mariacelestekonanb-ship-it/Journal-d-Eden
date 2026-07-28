"use client";

import type { CurrentProfile } from "@/shared/lib/auth/get-current-profile";

import { useRoleContext } from "../providers/role-provider";

export interface UseUserResult {
  profile: CurrentProfile | null;
  isLoading: boolean;
}

/** Profil applicatif (table `profiles`) de l'utilisateur connecté — nom, avatar, téléphone, rôle. */
export function useUser(): UseUserResult {
  const { profile, isLoading } = useRoleContext();
  return { profile, isLoading };
}
