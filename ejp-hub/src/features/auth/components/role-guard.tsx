"use client";

import type { ReactNode } from "react";

import type { Role } from "@/shared/constants/roles";

import { useRole } from "../hooks/use-role";

export interface RoleGuardProps {
  allow: Role[];
  children: ReactNode;
  /** Affiché à la place de `children` si le rôle n'est pas autorisé (rien par défaut). */
  fallback?: ReactNode;
}

/**
 * Masque `children` côté client si le rôle courant n'est pas autorisé.
 * Confort d'UI uniquement (évite d'afficher un bouton inutile) — la
 * véritable protection reste le middleware (routes) et la RLS (données).
 * Ne jamais l'utiliser comme seule protection d'une action sensible.
 */
export function RoleGuard({ allow, children, fallback = null }: RoleGuardProps) {
  const { hasAnyRole, isLoading } = useRole();

  if (isLoading) {
    return null;
  }

  return hasAnyRole(allow) ? <>{children}</> : <>{fallback}</>;
}
