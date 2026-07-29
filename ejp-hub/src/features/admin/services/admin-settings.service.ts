import { isSupabaseConfigured } from "@/shared/lib/supabase/config";

import { MockAdminRepository } from "../repositories/mock-admin-repository";
import type { AdminRepository } from "../repositories/admin-repository";
import { SupabaseAdminRepository } from "../repositories/supabase-admin-repository";
import type { PlatformSettings } from "../types/admin.types";
import type { PlatformSettingsFormValues } from "../validation/platform-settings.schema";

function getRepository(): AdminRepository {
  return isSupabaseConfigured() ? SupabaseAdminRepository : MockAdminRepository;
}

/** Paramètres généraux de la plateforme — nom, logo, description, fuseau horaire, langue. */
export const AdminSettingsService = {
  async get(): Promise<PlatformSettings> {
    return getRepository().getSettings();
  },

  async update(values: PlatformSettingsFormValues, updatedBy: string): Promise<PlatformSettings> {
    return getRepository().updateSettings(values, updatedBy);
  },
};
