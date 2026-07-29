import { AdminMapper } from "../mappers/admin.mapper";
import {
  createAuditLogEntryQuery,
  createCategoryQuery,
  deleteCategoryQuery,
  queryAllCategories,
  queryAuditLog,
  querySettings,
  updateCategoryQuery,
  updateSettingsQuery,
} from "../queries/admin.queries";
import type { AdminRepository } from "./admin-repository";

/**
 * Implémentation réelle de `AdminRepository`, branchée sur Supabase via la
 * clé `anon` (soumise à la RLS — `app_settings`, `admin_categories` et
 * `admin_audit_log` sont toutes réservées à un `ADMIN`, sans exception).
 */
export const SupabaseAdminRepository: AdminRepository = {
  async getSettings() {
    const row = await querySettings();
    return AdminMapper.toSettings(row);
  },

  async updateSettings(values, updatedBy) {
    const row = await updateSettingsQuery(values, updatedBy);
    return AdminMapper.toSettings(row);
  },

  async listCategories() {
    const rows = await queryAllCategories();
    return rows.map(AdminMapper.toCategory);
  },

  async createCategory(values) {
    const row = await createCategoryQuery(values);
    return AdminMapper.toCategory(row);
  },

  async updateCategory(id, values) {
    const row = await updateCategoryQuery(id, values);
    return AdminMapper.toCategory(row);
  },

  async removeCategory(id) {
    await deleteCategoryQuery(id);
  },

  async listAuditLog() {
    const rows = await queryAuditLog();
    return rows.map(AdminMapper.toAuditLogEntry);
  },

  async recordAuditLogEntry(input) {
    const row = await createAuditLogEntryQuery(input);
    return AdminMapper.toAuditLogEntry(row);
  },
};
