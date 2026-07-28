import { CalendarX } from "lucide-react";
import type { ReactNode } from "react";

import { AppEmptyState } from "@/shared/components/app-empty-state";

export interface PlanningEmptyStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
}

/** État vide dédié au Planning — même filtré, jamais une page blanche. */
export function PlanningEmptyState({
  title = "Aucun créneau",
  description = "Aucun créneau ne correspond à cette recherche. Essayez d'élargir vos filtres.",
  action,
}: PlanningEmptyStateProps) {
  return <AppEmptyState icon={CalendarX} title={title} description={description} action={action} />;
}
