import type { Role } from "@/shared/constants/roles";

export interface AdminPermissions {
  canAccess: boolean;
  canManageSettings: boolean;
  canManageRoles: boolean;
  canManageCategories: boolean;
  canViewAuditLog: boolean;
}

const FULL_ACCESS: AdminPermissions = {
  canAccess: true,
  canManageSettings: true,
  canManageRoles: true,
  canManageCategories: true,
  canViewAuditLog: true,
};

const NO_ACCESS: AdminPermissions = {
  canAccess: false,
  canManageSettings: false,
  canManageRoles: false,
  canManageCategories: false,
  canViewAuditLog: false,
};

/**
 * Le module Administration est réservé aux ADMIN sans exception — déjà
 * appliqué par `ROUTE_PERMISSIONS` (middleware) et par les RLS Supabase
 * (`public.is_admin()`) sur les trois tables du module. Ce util couvre le
 * dernier niveau, le rendu conditionnel côté composant.
 */
export function getAdminPermissions(role: Role | null): AdminPermissions {
  return role === "ADMIN" ? FULL_ACCESS : NO_ACCESS;
}
