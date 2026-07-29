import type { FieldErrors } from "react-hook-form";

import type { ReportFormValues } from "../validation/report.schema";

/**
 * Lit un message d'erreur Zod à un chemin dynamique (ex. `prayerPoints.2.references.0.reference`)
 * dans l'objet `errors` de React Hook Form — les listes imbriquées (versets
 * dans un point de prière) rendent le chemin trop dynamique pour un accès
 * typé direct (`errors.prayerPoints?.[i]?.references?.[j]?.reference`).
 */
export function getNestedError(errors: FieldErrors<ReportFormValues>, path: string): string | undefined {
  const segments = path.split(".");
  let node: unknown = errors;
  for (const segment of segments) {
    if (node == null || typeof node !== "object") return undefined;
    node = (node as Record<string, unknown>)[segment];
  }
  if (node && typeof node === "object" && "message" in node) {
    return (node as { message?: string }).message;
  }
  return undefined;
}
