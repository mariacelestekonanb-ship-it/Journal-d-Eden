import type { ReportFormValues } from "../validation/report.schema";

export interface ReportCompleteness {
  isComplete: boolean;
  missingFields: string[];
}

function isFilled(value: string | number | undefined): boolean {
  if (typeof value === "number") return Number.isFinite(value);
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Vérifie qu'un compte rendu est prêt à être soumis — utilisée avant
 * d'activer l'action « Soumettre » (bouton désactivé + liste des champs
 * manquants tant que `isComplete` est faux). Plus stricte que le schéma Zod
 * du formulaire (voir `validation/report.schema.ts`), qui reste
 * volontairement souple pour permettre l'enregistrement d'un brouillon
 * incomplet (aucun point de prière requis) à tout moment.
 */
export const ReportValidationService = {
  checkCompleteness(values: ReportFormValues): ReportCompleteness {
    const missingFields: string[] = [];

    if (!isFilled(values.generalInfo.date)) missingFields.push("Date");
    if (!isFilled(values.generalInfo.startTime)) missingFields.push("Heure de début");
    if (!isFilled(values.generalInfo.endTime)) missingFields.push("Heure de fin");
    if (!isFilled(values.generalInfo.connectedCount)) missingFields.push("Nombre de personnes connectées");
    if (values.prayerPoints.length === 0) missingFields.push("Au moins un point de prière");

    return { isComplete: missingFields.length === 0, missingFields };
  },
};
