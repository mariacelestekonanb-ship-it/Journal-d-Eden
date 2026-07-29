import { z } from "zod";

const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_PHOTO_TYPES = ["image/png", "image/jpeg", "image/webp"];

/**
 * Formulaire public « Rejoindre les Conducteurs de prière ». Le mot de passe
 * choisi ici sera utilisé pour créer le compte Supabase Auth dès la
 * soumission (voir `actions/create-membership-request.action.ts`) — la
 * demande reste `PENDING` et le compte inactif jusqu'à validation admin, le
 * mot de passe n'a donc pas besoin d'être conservé nulle part côté
 * application, Supabase Auth le hache immédiatement.
 */
export const memberJoinSchema = z
  .object({
    lastName: z.string().trim().min(1, "Le nom est obligatoire.").max(80, "Limité à 80 caractères."),
    firstName: z.string().trim().min(1, "Le prénom est obligatoire.").max(80, "Limité à 80 caractères."),
    email: z.string().trim().min(1, "L'adresse e-mail est requise.").email("Adresse e-mail invalide."),
    phone: z.string().trim().min(1, "Le numéro de téléphone est obligatoire.").max(30, "Limité à 30 caractères."),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères."),
    confirmPassword: z.string(),
    photo: z
      .instanceof(File)
      .refine((file) => file.size <= MAX_PHOTO_SIZE_BYTES, "La photo ne doit pas dépasser 5 Mo.")
      .refine((file) => ACCEPTED_PHOTO_TYPES.includes(file.type), "Formats acceptés : PNG, JPEG, WebP.")
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

export type MemberJoinFormValues = z.infer<typeof memberJoinSchema>;

export const DEFAULT_MEMBER_JOIN_FORM_VALUES: Omit<MemberJoinFormValues, "photo"> = {
  lastName: "",
  firstName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};
