import { z } from "zod";

/**
 * Une référence biblique — jamais vide dès qu'elle existe dans une liste
 * (règle imposée en continu, pas seulement à la soumission : un verset
 * ajouté puis vidé par erreur doit être signalé immédiatement).
 */
const bibleReferenceSchema = z.object({
  id: z.string(),
  reference: z.string().trim().min(1, "La référence ne peut pas être vide.").max(120, "Limité à 120 caractères."),
});

/** Un point de prière doit toujours avoir un titre dès qu'il existe — ses références suivent la même règle que les autres listes. */
const prayerPointSchema = z.object({
  id: z.string(),
  title: z.string().trim().min(1, "Le point de prière doit avoir un titre.").max(300, "Limité à 300 caractères."),
  references: z.array(bibleReferenceSchema),
});

const generalInfoSchema = z
  .object({
    date: z.string().min(1, "La date est obligatoire."),
    startTime: z.string().min(1, "L'heure de début est obligatoire."),
    endTime: z.string().min(1, "L'heure de fin est obligatoire."),
    connectedCount: z
      .union([z.coerce.number().int("Nombre entier attendu.").min(0, "Doit être positif ou nul."), z.nan()])
      .optional(),
    hasInstrumental: z.boolean(),
  })
  .refine((data) => !data.startTime || !data.endTime || data.endTime > data.startTime, {
    message: "L'heure de fin doit être après l'heure de début.",
    path: ["endTime"],
  });

/**
 * Schéma du formulaire — un brouillon reste enregistrable même incomplet
 * (aucun point de prière requis, annonces facultatives). Seules les règles
 * de forme des éléments déjà saisis (titre de point, référence non vide,
 * cohérence des horaires) sont vérifiées en continu par ce schéma. La
 * complétude nécessaire à la **soumission** (au moins un point de prière,
 * informations générales renseignées) est une règle métier distincte,
 * vérifiée par `ReportValidationService` (voir services/).
 */
export const reportFormSchema = z.object({
  generalInfo: generalInfoSchema,
  thanksgiving: z.array(bibleReferenceSchema),
  holySpiritInvitation: z.array(bibleReferenceSchema),
  prayerPoints: z.array(prayerPointSchema),
  closingThanksgiving: z.array(bibleReferenceSchema),
  announcements: z.string().max(2000, "Limité à 2000 caractères.").optional().or(z.literal("")),
});

export type ReportFormValues = z.infer<typeof reportFormSchema>;
export type BibleReferenceFormValue = z.infer<typeof bibleReferenceSchema>;
export type PrayerPointFormValue = z.infer<typeof prayerPointSchema>;

export const DEFAULT_REPORT_FORM_VALUES: ReportFormValues = {
  generalInfo: {
    date: "",
    startTime: "",
    endTime: "",
    connectedCount: undefined,
    hasInstrumental: false,
  },
  thanksgiving: [],
  holySpiritInvitation: [],
  prayerPoints: [],
  closingThanksgiving: [],
  announcements: "",
};
