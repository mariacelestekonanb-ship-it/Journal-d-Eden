import { AdminAuditService } from "../services/admin-audit.service";
import type { RecordAuditLogEntryInput } from "../repositories/admin-repository";
import type { AuditLogEntry } from "../types/admin.types";

export async function recordAuditLogEntryAction(input: RecordAuditLogEntryInput): Promise<AuditLogEntry> {
  return AdminAuditService.record(input);
}
