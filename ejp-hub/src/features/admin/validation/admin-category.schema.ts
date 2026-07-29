import { z } from "zod";

export const adminCategorySchema = z.object({
  scope: z.enum(["PRAYER_TOPIC_CATEGORY", "MEETING_TYPE"]),
  label: z.string().trim().min(1, "Le libellé est obligatoire.").max(80, "Limité à 80 caractères."),
  value: z
    .string()
    .trim()
    .min(1, "La valeur technique est obligatoire.")
    .max(60, "Limité à 60 caractères.")
    .regex(/^[A-Z0-9_]+$/, "Majuscules, chiffres et underscores uniquement (ex. NOUVELLE_CATEGORIE)."),
  sortOrder: z.coerce.number().int("Nombre entier attendu.").min(0, "Doit être positif ou nul."),
});

export type AdminCategoryFormValues = z.infer<typeof adminCategorySchema>;

export const DEFAULT_ADMIN_CATEGORY_FORM_VALUES: AdminCategoryFormValues = {
  scope: "PRAYER_TOPIC_CATEGORY",
  label: "",
  value: "",
  sortOrder: 0,
};
