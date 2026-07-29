import { z } from "zod";

const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_PHOTO_TYPES = ["image/png", "image/jpeg", "image/webp"];

/**
 * Auto-édition du profil — un membre peut modifier sa photo et son
 * téléphone, jamais son e-mail (réservé à un administrateur, voir
 * `member-email.schema.ts`) ni son rôle/statut.
 */
export const memberProfileSchema = z.object({
  phone: z.string().trim().min(1, "Le numéro de téléphone est obligatoire.").max(30, "Limité à 30 caractères."),
  photo: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_PHOTO_SIZE_BYTES, "La photo ne doit pas dépasser 5 Mo.")
    .refine((file) => ACCEPTED_PHOTO_TYPES.includes(file.type), "Formats acceptés : PNG, JPEG, WebP.")
    .optional(),
});

export type MemberProfileFormValues = z.infer<typeof memberProfileSchema>;
