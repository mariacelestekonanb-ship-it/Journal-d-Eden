"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateSettingsAction } from "../actions/update-settings.action";
import { AdminSettingsService } from "../services/admin-settings.service";
import type { PlatformSettingsFormValues } from "../validation/platform-settings.schema";

export const ADMIN_SETTINGS_KEY = ["admin", "settings"] as const;

export function useAdminSettings() {
  return useQuery({
    queryKey: ADMIN_SETTINGS_KEY,
    queryFn: () => AdminSettingsService.get(),
  });
}

export function useUpdateAdminSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ values, updatedBy }: { values: PlatformSettingsFormValues; updatedBy: string }) =>
      updateSettingsAction(values, updatedBy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SETTINGS_KEY });
      toast.success("Paramètres de la plateforme mis à jour.");
    },
    onError: (error) => toast.error(error.message),
  });
}
