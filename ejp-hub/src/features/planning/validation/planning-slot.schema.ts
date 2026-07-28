import { z } from "zod";

export const planningSlotSchema = z
  .object({
    slot_date: z.string().min(1, "La date est requise."),
    start_time: z.string().min(1, "L'heure de début est requise."),
    end_time: z.string().min(1, "L'heure de fin est requise."),
    conducteur_id: z.string().optional().or(z.literal("")),
    prayer_topic_id: z.string().optional().or(z.literal("")),
    location: z.string().max(200).optional().or(z.literal("")),
    notes: z.string().max(2000).optional().or(z.literal("")),
  })
  .refine((data) => data.end_time > data.start_time, {
    message: "L'heure de fin doit être postérieure à l'heure de début.",
    path: ["end_time"],
  });

export type PlanningSlotFormValues = z.infer<typeof planningSlotSchema>;
