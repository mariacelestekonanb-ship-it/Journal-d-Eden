"use client";

import type { Role } from "@/shared/constants/roles";

import { useRoleContext } from "../providers/role-provider";

export interface UseRoleResult {
  role: Role | null;
  isLoading: boolean;
  isAdmin: boolean;
  isPrayerLeader: boolean;
  hasRole: (role: Role) => boolean;
  hasAnyRole: (roles: Role[]) => boolean;
}

/** Rôle applicatif courant et helpers de permission (UI uniquement — voir RoleProvider). */
export function useRole(): UseRoleResult {
  const { role, isLoading, isAdmin, isPrayerLeader, hasRole, hasAnyRole } = useRoleContext();
  return { role, isLoading, isAdmin, isPrayerLeader, hasRole, hasAnyRole };
}
