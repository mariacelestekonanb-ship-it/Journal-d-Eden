import type { AppBadgeProps } from "@/shared/components/app-badge";

import type { ReportStatus } from "../types/report.types";

/** Source unique des libellés et couleurs de statut — utilisée par le badge, les filtres et l'export. */
export const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
  DRAFT: "Brouillon",
  SUBMITTED: "Soumis",
  VALIDATED: "Validé",
  REJECTED: "Rejeté",
};

export const REPORT_STATUS_BADGE_VARIANT: Record<ReportStatus, NonNullable<AppBadgeProps["variant"]>> = {
  DRAFT: "secondary",
  SUBMITTED: "warning",
  VALIDATED: "success",
  REJECTED: "destructive",
};

export const REPORT_STATUS_OPTIONS: ReportStatus[] = ["DRAFT", "SUBMITTED", "VALIDATED", "REJECTED"];
