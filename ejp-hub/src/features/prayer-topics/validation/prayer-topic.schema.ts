import { z } from "zod";

export const prayerTopicSchema = z
  .object({
    title: z.string().min(3, "Le titre doit contenir au moins 3 caractères.").max(200),
    description: z.string().max(2000).optional().or(z.literal("")),
    priority: z.enum(["haute", "moyenne", "basse"]),
    start_date: z.string().min(1, "La date de début est requise."),
    end_date: z.string().optional().or(z.literal("")),
  })
  .refine((data) => !data.end_date || data.end_date >= data.start_date, {
    message: "La date de fin doit être postérieure à la date de début.",
    path: ["end_date"],
  });

export type PrayerTopicFormValues = z.infer<typeof prayerTopicSchema>;
