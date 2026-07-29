import type { Report } from "../types/report.types";
import type { ReportFormValues } from "../validation/report.schema";

/** Pré-remplit le formulaire d'édition à partir d'un compte rendu existant. */
export function mapReportToFormValues(report: Report): ReportFormValues {
  return {
    generalInfo: {
      date: report.generalInfo.date,
      startTime: report.generalInfo.startTime,
      endTime: report.generalInfo.endTime,
      connectedCount: report.generalInfo.connectedCount ?? undefined,
      hasInstrumental: report.generalInfo.hasInstrumental,
    },
    thanksgiving: report.thanksgiving.map((reference) => ({ ...reference })),
    holySpiritInvitation: report.holySpiritInvitation.map((reference) => ({ ...reference })),
    prayerPoints: report.prayerPoints.map((point) => ({
      ...point,
      references: point.references.map((reference) => ({ ...reference })),
    })),
    closingThanksgiving: report.closingThanksgiving.map((reference) => ({ ...reference })),
    announcements: report.announcements,
  };
}
