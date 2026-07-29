import { getAdminRepository } from "../repositories/admin-repository";
import type { PlatformSettings } from "../types/admin.types";
import type { PlatformSettingsFormValues } from "../validation/platform-settings.schema";

/** Paramètres généraux de la plateforme — nom, logo, description, fuseau horaire, langue. */
export const AdminSettingsService = {
  async get(): Promise<PlatformSettings> {
    return getAdminRepository().getSettings();
  },

  async update(values: PlatformSettingsFormValues, updatedBy: string): Promise<PlatformSettings> {
    return getAdminRepository().updateSettings(values, updatedBy);
  },
};
