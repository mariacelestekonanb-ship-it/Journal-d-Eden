import { z } from "zod";

export const testimonySchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères.").max(200),
  content: z.string().min(10, "Le témoignage doit contenir au moins 10 caractères.").max(5000),
});

export type TestimonyFormValues = z.infer<typeof testimonySchema>;
