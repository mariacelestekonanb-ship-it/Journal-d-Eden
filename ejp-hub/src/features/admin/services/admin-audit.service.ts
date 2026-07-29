import { isSupabaseConfigured } from "@/shared/lib/supabase/config";

import { MockAdminRepository } from "../repositories/mock-admin-repository";
import type { AdminRepository, RecordAuditLogEntryInput } from "../repositories/admin-repository";
import { SupabaseAdminRepository } from "../repositories/supabase-admin-repository";
import type { AuditLogEntry } from "../types/admin.types";

function getRepository(): AdminRepository {
  return isSupabaseConfigured() ? SupabaseAdminRepository : MockAdminRepository;
}

/**
 * Journal des actions importantes de la plateforme. `record(...)` est prêt
 * pour que les autres modules y écrivent à chaque action notable — aucun
 * appelant n'existe encore ailleurs dans l'application (même limitation,
 * pour la même raison, que `NotificationService.notify` — voir ADMIN.md).
 */
export const AdminAuditService = {
  async list(): Promise<AuditLogEntry[]> {
    return getRepository().listAuditLog();
  },

  async record(input: RecordAuditLogEntryInput): Promise<AuditLogEntry> {
    return getRepository().recordAuditLogEntry(input);
  },
};
