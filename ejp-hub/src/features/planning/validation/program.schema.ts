import { z } from "zod";

export const programSchema = z.object({
  name: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères.").max(120, "Limité à 120 caractères."),
  description: z.string().trim().max(500, "Limité à 500 caractères.").optional().or(z.literal("")),
  memberIds: z.array(z.string()).default([]),
});

export type ProgramFormValues = z.infer<typeof programSchema>;

export const DEFAULT_PROGRAM_FORM_VALUES: ProgramFormValues = {
  name: "",
  description: "",
  memberIds: [],
};
