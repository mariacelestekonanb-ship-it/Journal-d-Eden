import { getFullName } from "@/shared/utils/get-full-name";

import type { RawAdminProfile, RawAuditLogRow, RawCategoryRow, RawSettingsRow } from "../queries/admin.queries";
import type { AdminActor, AdminCategory, AuditLogEntry, PlatformSettings } from "../types/admin.types";

function toActor(profile: RawAdminProfile | null): AdminActor | null {
  return profile ? { id: profile.id, fullName: getFullName(profile) } : null;
}

/**
 * Convertit les lignes brutes de `admin.queries.ts` en modèles métier. Isole
 * le reste du module de la forme exacte des tables `app_settings`,
 * `admin_categories` et `admin_audit_log`.
 */
export const AdminMapper = {
  toSettings(row: RawSettingsRow): PlatformSettings {
    return {
      platformName: row.platform_name,
      logoUrl: row.logo_url,
      description: row.description,
      timezone: row.timezone,
      language: row.language,
      updatedAt: row.updated_at,
      updatedBy: toActor(row.updated_by_profile),
    };
  },

  toCategory(row: RawCategoryRow): AdminCategory {
    return {
      id: row.id,
      scope: row.scope,
      label: row.label,
      value: row.value,
      sortOrder: row.sort_order,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  },

  toAuditLogEntry(row: RawAuditLogRow): AuditLogEntry {
    return {
      id: row.id,
      actor: toActor(row.actor),
      action: row.action,
      module: row.module,
      targetLabel: row.target_label,
      createdAt: row.created_at,
    };
  },
};
