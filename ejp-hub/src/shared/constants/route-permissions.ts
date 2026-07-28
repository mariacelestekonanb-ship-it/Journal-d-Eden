import type { Role } from "@/shared/constants/roles";

export interface RoutePermission {
  /** Préfixe de route (match par `pathname.startsWith(prefix)`). */
  prefix: string;
  /** Rôles autorisés à accéder à cette route. */
  roles: Role[];
}

/**
 * Permissions par route, consommées par le middleware ET par la sidebar
 * (voir `shared/components/layout/nav-items.ts`). Ajouter une route
 * réservée à un rôle se fait uniquement ici — aucune autre modification
 * n'est nécessaire pour que le middleware la protège.
 */
export const ROUTE_PERMISSIONS: RoutePermission[] = [{ prefix: "/administration", roles: ["ADMIN"] }];

export function getRequiredRoles(pathname: string): Role[] | null {
  const match = ROUTE_PERMISSIONS.find((permission) => pathname.startsWith(permission.prefix));
  return match?.roles ?? null;
}
