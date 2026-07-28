import { z } from "zod";

export const reportSchema = z.object({
  attendees_count: z.coerce.number().int().min(0, "Le nombre de présents doit être positif.").optional(),
  topics_covered: z.string().max(2000).optional().or(z.literal("")),
  content: z.string().min(10, "Le compte rendu doit contenir au moins 10 caractères."),
  follow_up: z.string().max(2000).optional().or(z.literal("")),
});

export type ReportFormValues = z.infer<typeof reportSchema>;
