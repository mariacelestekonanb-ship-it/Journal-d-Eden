import type { AdminCategoryScope as DbAdminCategoryScope } from "@/shared/types/database";

export type AdminCategoryScope = DbAdminCategoryScope;

/** Administrateur ayant enregistré une modification (paramètres). */
export interface AdminActor {
  id: string;
  fullName: string;
}

export interface PlatformSettings {
  platformName: string;
  logoUrl: string | null;
  description: string | null;
  timezone: string;
  language: string;
  updatedAt: string;
  updatedBy: AdminActor | null;
}

/** Une entrée de liste configurable (catégorie de sujet de prière, type de réunion…). */
export interface AdminCategory {
  id: string;
  scope: AdminCategoryScope;
  label: string;
  value: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

/** Une ligne du journal d'administration. */
export interface AuditLogEntry {
  id: string;
  actor: AdminActor | null;
  action: string;
  module: string;
  targetLabel: string | null;
  createdAt: string;
}

export interface AdminAuditFilters {
  search: string;
  module: string | null;
  dateFrom: string | null;
  dateTo: string | null;
}

export const EMPTY_ADMIN_AUDIT_FILTERS: AdminAuditFilters = {
  search: "",
  module: null,
  dateFrom: null,
  dateTo: null,
};

/** Les 7 indicateurs du tableau de bord Administration — agrégés depuis les services publics des autres modules. */
export interface AdminDashboardStats {
  totalMembers: number;
  activeLeaders: number;
  pendingMembershipRequests: number;
  scheduledSlots: number;
  pendingReports: number;
  activePrayerTopics: number;
  unreadNotifications: number;
}

export type AdminSearchResultType = "MEMBER" | "REPORT" | "PRAYER_TOPIC" | "PLANNING";

/** Un résultat de la recherche globale — une entrée par élément trouvé, tous modules confondus. */
export interface AdminSearchResult {
  id: string;
  type: AdminSearchResultType;
  title: string;
  subtitle: string | null;
  url: string;
}
