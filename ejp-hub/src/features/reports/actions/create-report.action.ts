import { ReportService } from "../services/report.service";
import type { Report, ReportParticipant } from "../types/report.types";
import type { ReportFormValues } from "../validation/report.schema";

/**
 * Actions = la surface d'écriture du module, appelée par les hooks
 * (`use-report-mutations.ts`) et par rien d'autre. Aujourd'hui de simples
 * façades vers `ReportService` ; le jour où une mutation nécessitera un
 * contexte serveur, seul ce fichier change.
 */
export async function createReportAction(
  values: ReportFormValues,
  slotId: string,
  leader: ReportParticipant,
  author: ReportParticipant,
): Promise<Report> {
  return ReportService.create(values, slotId, leader, author);
}
