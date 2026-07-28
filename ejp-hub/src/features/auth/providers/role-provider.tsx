"use client";

import { useQuery } from "@tanstack/react-query";
import * as React from "react";

import { MOCK_PROFILE } from "@/shared/constants/mock-profile";
import type { Role } from "@/shared/constants/roles";
import type { CurrentProfile } from "@/shared/lib/auth/get-current-profile";
import { isSupabaseConfigured } from "@/shared/lib/supabase/config";

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

  const { data: fetchedProfile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["auth-profile", userId],
    queryFn: () => fetchProfileById(userId ?? ""),
    enabled: !!userId,
  });

  // Tant que Supabase n'est pas configuré, le profil de démonstration tient
  // lieu d'utilisateur connecté côté client — même logique que
  // `resolveProfile()` côté serveur (voir shared/lib/auth/resolve-profile.ts).
  const profile = isSupabaseConfigured() ? (fetchedProfile ?? null) : MOCK_PROFILE;
  const role = profile?.role ?? null;

  const value = React.useMemo<RoleContextValue>(() => {
    const hasRole = (candidate: Role) => role === candidate;
    const hasAnyRole = (roles: Role[]) => !!role && roles.includes(role);

    return {
      profile,
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
