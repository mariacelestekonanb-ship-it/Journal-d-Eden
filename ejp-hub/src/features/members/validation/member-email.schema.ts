import { z } from "zod";

/** Changement d'e-mail — réservé à un administrateur (voir `ReportPermissions`-style `getMemberPermissions`). */
export const memberEmailSchema = z.object({
  email: z.string().trim().min(1, "L'adresse e-mail est requise.").email("Adresse e-mail invalide."),
});

export type MemberEmailFormValues = z.infer<typeof memberEmailSchema>;
