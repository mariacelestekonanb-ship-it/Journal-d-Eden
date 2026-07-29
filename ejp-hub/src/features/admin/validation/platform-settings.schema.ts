import { z } from "zod";

export const platformSettingsSchema = z.object({
  platformName: z.string().trim().min(1, "Le nom de la plateforme est obligatoire.").max(80, "Limité à 80 caractères."),
  logoUrl: z.string().trim().max(500, "Limité à 500 caractères.").url("URL invalide.").optional().or(z.literal("")),
  description: z.string().trim().max(500, "Limité à 500 caractères.").optional().or(z.literal("")),
  timezone: z.string().trim().min(1, "Le fuseau horaire est obligatoire."),
  language: z.string().trim().min(1, "La langue est obligatoire."),
});

export type PlatformSettingsFormValues = z.infer<typeof platformSettingsSchema>;
