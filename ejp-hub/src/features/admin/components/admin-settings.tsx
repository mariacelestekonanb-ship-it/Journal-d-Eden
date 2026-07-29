"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { useUser } from "@/features/auth";
import { AppButton } from "@/shared/components/app-button";
import { AppCard, AppCardContent, AppCardHeader, AppCardTitle } from "@/shared/components/app-card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Skeleton } from "@/shared/ui/skeleton";
import { Textarea } from "@/shared/ui/textarea";
import { formatDateTime } from "@/shared/utils/format";

import { useAdminSettings, useUpdateAdminSettings } from "../hooks/use-admin-settings";
import type { PlatformSettings } from "../types/admin.types";
import { platformSettingsSchema, type PlatformSettingsFormValues } from "../validation/platform-settings.schema";

const TIMEZONE_OPTIONS = ["Europe/Paris", "Europe/Brussels", "America/Port-au-Prince", "America/Montreal", "UTC"];
const LANGUAGE_OPTIONS: { value: string; label: string }[] = [
  { value: "fr", label: "Français" },
  { value: "en", label: "English" },
];

function toFormValues(settings: PlatformSettings): PlatformSettingsFormValues {
  return {
    platformName: settings.platformName,
    logoUrl: settings.logoUrl ?? "",
    description: settings.description ?? "",
    timezone: settings.timezone,
    language: settings.language,
  };
}

/** Paramètres généraux de la plateforme — nom, logo, description, fuseau horaire, langue. */
export function AdminSettings() {
  const { data: settings, isLoading } = useAdminSettings();

  if (isLoading || !settings) {
    return (
      <AppCard className="space-y-4 p-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
      </AppCard>
    );
  }

  // Ne monte le formulaire qu'une fois `settings` disponible : les <Select> ont besoin
  // d'une valeur initiale correcte dès leur premier rendu (voir `defaultValues` ci-dessous)
  // plutôt que d'une mise à jour tardive via `values`, que Radix Select n'affiche pas
  // fidèlement tant qu'aucune interaction utilisateur n'a eu lieu sur le contrôle.
  return <AdminSettingsForm key={settings.updatedAt} settings={settings} />;
}

function AdminSettingsForm({ settings }: { settings: PlatformSettings }) {
  const { profile } = useUser();
  const updateMutation = useUpdateAdminSettings();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<PlatformSettingsFormValues>({
    resolver: zodResolver(platformSettingsSchema),
    defaultValues: toFormValues(settings),
  });

  async function onSubmit(values: PlatformSettingsFormValues) {
    if (!profile) return;
    const updated = await updateMutation.mutateAsync({ values, updatedBy: profile.id });
    reset(toFormValues(updated));
  }

  return (
    <AppCard className="p-4">
      <AppCardHeader className="p-0 pb-4">
        <AppCardTitle>Paramètres généraux</AppCardTitle>
        <p className="text-xs text-muted-foreground">
          Dernière modification {formatDateTime(settings.updatedAt)}
          {settings.updatedBy && ` par ${settings.updatedBy.fullName}`}.
        </p>
      </AppCardHeader>
      <AppCardContent className="p-0">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="platformName">Nom de la plateforme</Label>
            <Input id="platformName" aria-invalid={!!errors.platformName} {...register("platformName")} />
            {errors.platformName && <p className="text-xs text-destructive">{errors.platformName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="logoUrl">URL du logo</Label>
            <Input id="logoUrl" placeholder="https://…" aria-invalid={!!errors.logoUrl} {...register("logoUrl")} />
            {errors.logoUrl && <p className="text-xs text-destructive">{errors.logoUrl.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={3} aria-invalid={!!errors.description} {...register("description")} />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="timezone">Fuseau horaire</Label>
              <Controller
                control={control}
                name="timezone"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEZONE_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Langue</Label>
              <Controller
                control={control}
                name="language"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <AppButton type="submit" isLoading={updateMutation.isPending} disabled={!isDirty}>
              Enregistrer
            </AppButton>
          </div>
        </form>
      </AppCardContent>
    </AppCard>
  );
}
