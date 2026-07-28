import { z } from "zod";

export const profileSchema = z.object({
  full_name: z.string().min(2, "Le nom complet doit contenir au moins 2 caractères.").max(120),
  phone: z.string().max(30).optional().or(z.literal("")),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const passwordSchema = z
  .object({
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

export type PasswordFormValues = z.infer<typeof passwordSchema>;
