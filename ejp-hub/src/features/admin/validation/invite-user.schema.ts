import { z } from "zod";

export const inviteUserSchema = z.object({
  full_name: z.string().min(2, "Le nom complet doit contenir au moins 2 caractères.").max(120),
  email: z.string().min(1, "L'adresse e-mail est requise.").email("Adresse e-mail invalide."),
  role: z.enum(["admin", "conducteur"]),
});

export type InviteUserFormValues = z.infer<typeof inviteUserSchema>;
