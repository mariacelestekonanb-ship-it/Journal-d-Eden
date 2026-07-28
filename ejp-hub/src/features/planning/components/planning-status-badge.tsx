import * as React from "react";

import { AppBadge } from "@/shared/components/app-badge";

import type { PlanningStatus } from "../types/planning.types";
import { PLANNING_STATUS_BADGE_VARIANT, PLANNING_STATUS_LABELS } from "../utils/planning-status";

export interface PlanningStatusBadgeProps {
  status: PlanningStatus;
  className?: string;
}

function PlanningStatusBadgeComponent({ status, className }: PlanningStatusBadgeProps) {
  return (
    <AppBadge variant={PLANNING_STATUS_BADGE_VARIANT[status]} className={className}>
      {PLANNING_STATUS_LABELS[status]}
    </AppBadge>
  );
}

/** Badge de statut réutilisable (Planning, mais aussi futurs modules dépendants — comptes rendus, etc.). */
export const PlanningStatusBadge = React.memo(PlanningStatusBadgeComponent);
