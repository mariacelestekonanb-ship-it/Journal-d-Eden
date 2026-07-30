import { z } from "zod";

export const planningSlotSchema = z
  .object({
    title: z.string().min(3, "Le titre doit contenir au moins 3 caractères.").max(200),
    description: z.string().max(2000).optional().or(z.literal("")),
    date: z.string().min(1, "La date est requise."),
    startTime: z.string().min(1, "L'heure de début est requise."),
    endTime: z.string().min(1, "L'heure de fin est requise."),
    location: z.string().max(200).optional().or(z.literal("")),
    primaryLeaderId: z.string().min(1, "Le conducteur principal est requis."),
    secondaryLeaderId: z.string().optional().or(z.literal("")),
    theme: z.string().max(100).optional().or(z.literal("")),
    prayerTopicId: z.string().optional().or(z.literal("")),
    programId: z.string().optional().or(z.literal("")),
    status: z.enum(["DRAFT", "CONFIRMED", "COMPLETED", "CANCELLED"]),
    notes: z.string().max(2000).optional().or(z.literal("")),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "L'heure de fin doit être postérieure à l'heure de début.",
    path: ["endTime"],
  })
  .refine((data) => !data.secondaryLeaderId || data.secondaryLeaderId !== data.primaryLeaderId, {
    message: "Le conducteur secondaire doit être différent du conducteur principal.",
    path: ["secondaryLeaderId"],
  });

export type PlanningSlotFormValues = z.infer<typeof planningSlotSchema>;

export const DEFAULT_PLANNING_SLOT_FORM_VALUES: PlanningSlotFormValues = {
  title: "",
  description: "",
  date: new Date().toISOString().slice(0, 10),
  startTime: "18:00",
  endTime: "19:00",
  location: "",
  primaryLeaderId: "",
  secondaryLeaderId: "",
  theme: "",
  prayerTopicId: "",
  programId: "",
  status: "DRAFT",
  notes: "",
};
