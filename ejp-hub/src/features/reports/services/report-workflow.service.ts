import type { ReportStatus } from "../types/report.types";

/**
 * Machine à états du workflow des comptes rendus — pure et indépendante des
 * rôles (les permissions par rôle vivent dans `utils/report-permissions.ts`,
 * combinées à ce service par les composants) :
 *
 *   DRAFT ──submit──► SUBMITTED ──validate──► VALIDATED
 *     ▲                   │
 *     └──────reject───────┘ (REJECTED, éditable et resoumissible)
 */
export const ReportWorkflowService = {
  isEditable(status: ReportStatus): boolean {
    return status === "DRAFT" || status === "REJECTED";
  },

  isSubmittable(status: ReportStatus): boolean {
    return status === "DRAFT" || status === "REJECTED";
  },

  isValidatable(status: ReportStatus): boolean {
    return status === "SUBMITTED";
  },

  isRejectable(status: ReportStatus): boolean {
    return status === "SUBMITTED";
  },
};
