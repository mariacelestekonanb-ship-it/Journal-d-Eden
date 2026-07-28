import { z } from "zod";

import type { PrayerTopicCategory, PrayerTopicPriority, PrayerTopicStatus } from "../types/prayer-topic.types";

export const PRAYER_TOPIC_CATEGORY_VALUES = [
  "CHURCH",
  "FAMILY",
  "YOUTH",
  "EVANGELISM",
  "HEALING",
  "NATIONS",
  "PERSONAL",
] as const satisfies readonly PrayerTopicCategory[];

export const PRAYER_TOPIC_PRIORITY_VALUES = [
  "LOW",
  "NORMAL",
  "HIGH",
  "URGENT",
] as const satisfies readonly PrayerTopicPriority[];

export const PRAYER_TOPIC_STATUS_VALUES = [
  "DRAFT",
  "ACTIVE",
  "COMPLETED",
  "ARCHIVED",
] as const satisfies readonly PrayerTopicStatus[];

/** Validation partagée entre le formulaire (messages d'erreur) et, plus tard, une vérification côté serveur. */
export const prayerTopicSchema = z
  .object({
    title: z.string().trim().min(1, "Le titre est obligatoire.").max(150, "Le titre est limité à 150 caractères."),
    description: z
      .string()
      .max(2000, "La description est limitée à 2000 caractères.")
      .optional()
      .or(z.literal("")),
    category: z.enum(PRAYER_TOPIC_CATEGORY_VALUES),
    priority: z.enum(PRAYER_TOPIC_PRIORITY_VALUES),
    status: z.enum(PRAYER_TOPIC_STATUS_VALUES),
    startDate: z.string().min(1, "La date de début est obligatoire."),
    endDate: z.string().optional().or(z.literal("")),
  })
  .refine((data) => !data.endDate || data.endDate >= data.startDate, {
    message: "La date de fin doit être postérieure ou égale à la date de début.",
    path: ["endDate"],
  });

export type PrayerTopicFormValues = z.infer<typeof prayerTopicSchema>;

export const DEFAULT_PRAYER_TOPIC_FORM_VALUES: PrayerTopicFormValues = {
  title: "",
  description: "",
  category: "CHURCH",
  priority: "NORMAL",
  status: "DRAFT",
  startDate: new Date().toISOString().slice(0, 10),
  endDate: "",
};
