import * as React from "react";

import { AppBadge } from "@/shared/components/app-badge";

import type { ReportStatus } from "../types/report.types";
import { REPORT_STATUS_BADGE_VARIANT, REPORT_STATUS_LABELS } from "../utils/report-status";

export interface ReportStatusBadgeProps {
  status: ReportStatus;
  className?: string;
}

function ReportStatusBadgeComponent({ status, className }: ReportStatusBadgeProps) {
  return (
    <AppBadge variant={REPORT_STATUS_BADGE_VARIANT[status]} className={className}>
      {REPORT_STATUS_LABELS[status]}
    </AppBadge>
  );
}

/** Badge de statut réutilisable (table, détail, historique). */
export const ReportStatusBadge = React.memo(ReportStatusBadgeComponent);
