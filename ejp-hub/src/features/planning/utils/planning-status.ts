import type { AppBadgeProps } from "@/shared/components/app-badge";

import type { PlanningStatus } from "../types/planning.types";

/** Source unique des libellés et couleurs de statut — utilisée par le badge, le formulaire et l'export. */
export const PLANNING_STATUS_LABELS: Record<PlanningStatus, string> = {
  DRAFT: "Brouillon",
  CONFIRMED: "Confirmé",
  COMPLETED: "Terminé",
  CANCELLED: "Annulé",
};

export const PLANNING_STATUS_BADGE_VARIANT: Record<PlanningStatus, NonNullable<AppBadgeProps["variant"]>> = {
  DRAFT: "secondary",
  CONFIRMED: "success",
  COMPLETED: "outline",
  CANCELLED: "destructive",
};

export const PLANNING_STATUS_OPTIONS: PlanningStatus[] = ["DRAFT", "CONFIRMED", "COMPLETED", "CANCELLED"];
