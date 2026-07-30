/**
 * Point d'entrée public du module Administration. Les autres modules (et
 * les routes de `src/app/`) ne doivent importer que depuis ce fichier —
 * jamais un chemin profond vers `services/`, `repositories/`, `queries/`,
 * `data/`, etc.
 */
export { AdminDashboardView } from "./pages/admin-dashboard-view";
export { AdminRolesView } from "./pages/admin-roles-view";
export { AdminSettingsView } from "./pages/admin-settings-view";
export { AdminCategoriesView } from "./pages/admin-categories-view";
export { AdminAuditLogView } from "./pages/admin-audit-log-view";
export type {
  AdminCategory,
  AdminCategoryScope,
  AdminDashboardStats,
  AdminSearchResult,
  AdminSearchResultType,
  AuditLogEntry,
  PlatformSettings,
} from "./types/admin.types";
export { AdminService } from "./services/admin.service";
export { AdminSettingsService } from "./services/admin-settings.service";
export { AdminAuditService } from "./services/admin-audit.service";
export { AdminBackupService } from "./services/admin-backup.service";
export { getAdminPermissions, type AdminPermissions } from "./utils/admin-permissions";
