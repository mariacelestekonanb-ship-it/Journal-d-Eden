import { AdminSettingsService } from "../services/admin-settings.service";
import type { PlatformSettings } from "../types/admin.types";
import type { PlatformSettingsFormValues } from "../validation/platform-settings.schema";

export async function updateSettingsAction(values: PlatformSettingsFormValues, updatedBy: string): Promise<PlatformSettings> {
  return AdminSettingsService.update(values, updatedBy);
}
