import { INITIAL_MOCK_AUDIT_LOG, INITIAL_MOCK_CATEGORIES, INITIAL_MOCK_SETTINGS } from "../data/admin.mocks";
import type { AdminCategory, AuditLogEntry, PlatformSettings } from "../types/admin.types";
import type { AdminRepository } from "./admin-repository";

/**
 * Implémentation en mémoire de `AdminRepository`, utilisée tant que
 * Supabase n'est pas configuré. L'état est mutable au niveau du module pour
 * que les paramètres, les catégories et le journal restent réellement
 * interactifs en mode démo.
 */
let settings: PlatformSettings = { ...INITIAL_MOCK_SETTINGS };
let categories: AdminCategory[] = INITIAL_MOCK_CATEGORIES.map((category) => ({ ...category }));
let auditLog: AuditLogEntry[] = INITIAL_MOCK_AUDIT_LOG.map((entry) => ({ ...entry }));

function requireCategory(id: string): AdminCategory {
  const found = categories.find((category) => category.id === id);
  if (!found) throw new Error("Catégorie introuvable.");
  return found;
}

export const MockAdminRepository: AdminRepository = {
  async getSettings() {
    return { ...settings };
  },

  async updateSettings(values, updatedBy) {
    settings = {
      platformName: values.platformName,
      logoUrl: values.logoUrl || null,
      description: values.description || null,
      timezone: values.timezone,
      language: values.language,
      updatedAt: new Date().toISOString(),
      updatedBy: { id: updatedBy, fullName: "Utilisateur Démo" },
    };
    return { ...settings };
  },

  async listCategories() {
    return [...categories]
      .sort((a, b) => a.scope.localeCompare(b.scope) || a.sortOrder - b.sortOrder)
      .map((category) => ({ ...category }));
  },

  async createCategory(values) {
    const now = new Date().toISOString();
    const created: AdminCategory = {
      id: crypto.randomUUID(),
      scope: values.scope,
      label: values.label,
      value: values.value,
      sortOrder: values.sortOrder,
      createdAt: now,
      updatedAt: now,
    };
    categories = [...categories, created];
    return created;
  },

  async updateCategory(id, values) {
    const existing = requireCategory(id);
    const updated: AdminCategory = {
      ...existing,
      label: values.label,
      value: values.value,
      sortOrder: values.sortOrder,
      updatedAt: new Date().toISOString(),
    };
    categories = categories.map((category) => (category.id === id ? updated : category));
    return updated;
  },

  async removeCategory(id) {
    requireCategory(id);
    categories = categories.filter((category) => category.id !== id);
  },

  async listAuditLog() {
    return [...auditLog].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map((entry) => ({ ...entry }));
  },

  async recordAuditLogEntry(input) {
    const created: AuditLogEntry = {
      id: crypto.randomUUID(),
      actor: { id: input.actorId, fullName: "Utilisateur Démo" },
      action: input.action,
      module: input.module,
      targetLabel: input.targetLabel ?? null,
      createdAt: new Date().toISOString(),
    };
    auditLog = [created, ...auditLog];
    return created;
  },
};
