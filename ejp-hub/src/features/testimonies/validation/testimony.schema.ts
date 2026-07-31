import { z } from "zod";

export const testimonySchema = z.object({
  title: z.string().trim().min(3, "Le titre doit contenir au moins 3 caractères.").max(150, "Limité à 150 caractères."),
  content: z.string().trim().min(10, "Le témoignage doit contenir au moins 10 caractères.").max(5000, "Limité à 5000 caractères."),
});

export type TestimonyFormValues = z.infer<typeof testimonySchema>;

export const DEFAULT_TESTIMONY_FORM_VALUES: TestimonyFormValues = {
  title: "",
  content: "",
};
