import type { AdminCategory, AuditLogEntry, PlatformSettings } from "../types/admin.types";
import type { AdminCategoryFormValues } from "../validation/admin-category.schema";
import type { PlatformSettingsFormValues } from "../validation/platform-settings.schema";

export interface RecordAuditLogEntryInput {
  actorId: string;
  action: string;
  module: string;
  targetLabel?: string | null;
}

/**
 * Contrat d'accès aux données propres au module Administration (paramètres,
 * catégories, journal) — indépendant de la source réelle. Les autres
 * données affichées par ce module (membres, comptes rendus, planning,
 * sujets de prière, notifications) ne sont **jamais** lues via ce contrat :
 * `AdminService` les obtient directement via les services publics des
 * modules concernés (`MemberService`, `ReportService`…), jamais dupliquées
 * ici.
 */
export interface AdminRepository {
  getSettings(): Promise<PlatformSettings>;
  updateSettings(values: PlatformSettingsFormValues, updatedBy: string): Promise<PlatformSettings>;
  listCategories(): Promise<AdminCategory[]>;
  createCategory(values: AdminCategoryFormValues): Promise<AdminCategory>;
  updateCategory(id: string, values: AdminCategoryFormValues): Promise<AdminCategory>;
  removeCategory(id: string): Promise<void>;
  listAuditLog(): Promise<AuditLogEntry[]>;
  recordAuditLogEntry(input: RecordAuditLogEntryInput): Promise<AuditLogEntry>;
}
