"use client";

import { useQuery } from "@tanstack/react-query";
import * as React from "react";

import type { Role } from "@/shared/constants/roles";
import type { CurrentProfile } from "@/shared/lib/auth/get-current-profile";

import { fetchProfileById } from "../services/auth.service";
import { useAuthContext } from "./auth-provider";

export interface RoleContextValue {
  profile: CurrentProfile | null;
  role: Role | null;
  isLoading: boolean;
  isAdmin: boolean;
  isPrayerLeader: boolean;
  hasRole: (role: Role) => boolean;
  hasAnyRole: (roles: Role[]) => boolean;
}

const RoleContext = React.createContext<RoleContextValue | undefined>(undefined);

/**
 * Dérive le profil applicatif (table `profiles`, dont le rôle) de
 * l'utilisateur authentifié par `AuthProvider`. Doit être monté à
 * l'intérieur d'un `<AuthProvider>`.
 *
 * Comme pour `useAuth()`, ceci sert à masquer/afficher des éléments d'UI
 * côté client — jamais à décider seul qui a accès à une donnée ou une route
 * (voir middleware.ts et supabase/migrations/ pour la RLS).
 */
export function RoleProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: isAuthLoading } = useAuthContext();

  const userId = user?.id;

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["auth-profile", userId],
    queryFn: () => fetchProfileById(userId ?? ""),
    enabled: !!userId,
  });

  const role = profile?.role ?? null;

  const value = React.useMemo<RoleContextValue>(() => {
    const hasRole = (candidate: Role) => role === candidate;
    const hasAnyRole = (roles: Role[]) => !!role && roles.includes(role);

    return {
      profile: profile ?? null,
      role,
      isLoading: isAuthLoading || (!!user && isProfileLoading),
      isAdmin: role === "ADMIN",
      isPrayerLeader: role === "PRAYER_LEADER",
      hasRole,
      hasAnyRole,
    };
  }, [profile, role, isAuthLoading, isProfileLoading, user]);

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRoleContext(): RoleContextValue {
  const context = React.useContext(RoleContext);
  if (!context) {
    throw new Error("useRole/useUser doivent être utilisés à l'intérieur de <RoleProvider>.");
  }
  return context;
}
