import { getAdminRepository, type RecordAuditLogEntryInput } from "../repositories/admin-repository";
import type { AuditLogEntry } from "../types/admin.types";

/**
 * Journal des actions importantes de la plateforme. `record(...)` est prêt
 * pour que les autres modules y écrivent à chaque action notable — aucun
 * appelant n'existe encore ailleurs dans l'application (même limitation,
 * pour la même raison, que `NotificationService.notify` — voir ADMIN.md).
 */
export const AdminAuditService = {
  async list(): Promise<AuditLogEntry[]> {
    return getAdminRepository().listAuditLog();
  },

  async record(input: RecordAuditLogEntryInput): Promise<AuditLogEntry> {
    return getAdminRepository().recordAuditLogEntry(input);
  },
};
