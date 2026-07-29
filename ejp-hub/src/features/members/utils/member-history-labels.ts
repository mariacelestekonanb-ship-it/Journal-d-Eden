import type { PlanningStatus, ReportStatus } from "@/shared/types/database";

/**
 * Libellés locaux, uniquement pour l'affichage compact de l'historique d'un
 * membre (fiche membre). Les modules Planning et Comptes rendus
 * n'exportent pas leurs badges de statut via leur `index.ts` public (règle
 * d'architecture : un module ne consomme d'un autre que ce qu'il expose) —
 * dupliquer ces deux libellés ici est un compromis délibéré, largement
 * moins coûteux que d'élargir la surface publique de deux modules pour un
 * simple texte dans une liste.
 */
export const PLANNING_STATUS_LABELS_FOR_HISTORY: Record<PlanningStatus, string> = {
  DRAFT: "Brouillon",
  CONFIRMED: "Confirmé",
  COMPLETED: "Terminé",
  CANCELLED: "Annulé",
};

export const REPORT_STATUS_LABELS_FOR_HISTORY: Record<ReportStatus, string> = {
  DRAFT: "Brouillon",
  SUBMITTED: "Soumis",
  VALIDATED: "Validé",
  REJECTED: "Rejeté",
};
