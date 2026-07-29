import { createClient } from "@/shared/lib/supabase/client";
import type { AdminCategoryScope } from "@/shared/types/database";

import type { AdminCategoryFormValues } from "../validation/admin-category.schema";
import type { PlatformSettingsFormValues } from "../validation/platform-settings.schema";

/**
 * Requêtes Supabase brutes du module Administration. Ce fichier est le seul
 * à connaître le schéma de `app_settings`, `admin_categories` et
 * `admin_audit_log` — jamais appelé depuis un composant (voir
 * `repositories/admin-repository.ts`).
 */

export interface RawAdminProfile {
  id: string;
  firstname: string;
  lastname: string;
}

export interface RawSettingsRow {
  id: string;
  platform_name: string;
  logo_url: string | null;
  description: string | null;
  timezone: string;
  language: string;
  updated_at: string;
  updated_by_profile: RawAdminProfile | null;
}

export interface RawCategoryRow {
  id: string;
  scope: AdminCategoryScope;
  label: string;
  value: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface RawAuditLogRow {
  id: string;
  action: string;
  module: string;
  target_label: string | null;
  created_at: string;
  actor: RawAdminProfile | null;
}

const SETTINGS_SELECT =
  "id, platform_name, logo_url, description, timezone, language, updated_at, updated_by_profile:profiles!app_settings_updated_by_fkey(id, firstname, lastname)";

export async function querySettings(): Promise<RawSettingsRow> {
  const supabase = createClient();
  const { data, error } = await supabase.from("app_settings").select(SETTINGS_SELECT).limit(1).single();

  if (error) throw new Error(error.message);
  return data as unknown as RawSettingsRow;
}

export async function updateSettingsQuery(values: PlatformSettingsFormValues, updatedBy: string): Promise<RawSettingsRow> {
  const supabase = createClient();
  const { data: existing, error: existingError } = await supabase.from("app_settings").select("id").limit(1).single();
  if (existingError) throw new Error(existingError.message);

  const { data, error } = await supabase
    .from("app_settings")
    .update({
      platform_name: values.platformName,
      logo_url: values.logoUrl || null,
      description: values.description || null,
      timezone: values.timezone,
      language: values.language,
      updated_by: updatedBy,
    })
    .eq("id", existing.id)
    .select(SETTINGS_SELECT)
    .single();

  if (error) throw new Error(error.message);
  return data as unknown as RawSettingsRow;
}

const CATEGORY_SELECT = "id, scope, label, value, sort_order, created_at, updated_at";

export async function queryAllCategories(): Promise<RawCategoryRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("admin_categories")
    .select(CATEGORY_SELECT)
    .order("scope", { ascending: true })
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return data as unknown as RawCategoryRow[];
}

export async function createCategoryQuery(values: AdminCategoryFormValues): Promise<RawCategoryRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("admin_categories")
    .insert({ scope: values.scope, label: values.label, value: values.value, sort_order: values.sortOrder })
    .select(CATEGORY_SELECT)
    .single();

  if (error) throw new Error(error.message);
  return data as unknown as RawCategoryRow;
}

export async function updateCategoryQuery(id: string, values: AdminCategoryFormValues): Promise<RawCategoryRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("admin_categories")
    .update({ label: values.label, value: values.value, sort_order: values.sortOrder })
    .eq("id", id)
    .select(CATEGORY_SELECT)
    .single();

  if (error) throw new Error(error.message);
  return data as unknown as RawCategoryRow;
}

export async function deleteCategoryQuery(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("admin_categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function queryAuditLog(): Promise<RawAuditLogRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("admin_audit_log")
    .select("id, action, module, target_label, created_at, actor:profiles(id, firstname, lastname)")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as unknown as RawAuditLogRow[];
}

export async function createAuditLogEntryQuery(input: {
  actorId: string;
  action: string;
  module: string;
  targetLabel?: string | null;
}): Promise<RawAuditLogRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("admin_audit_log")
    .insert({ actor_id: input.actorId, action: input.action, module: input.module, target_label: input.targetLabel ?? null })
    .select("id, action, module, target_label, created_at, actor:profiles(id, firstname, lastname)")
    .single();

  if (error) throw new Error(error.message);
  return data as unknown as RawAuditLogRow;
}
