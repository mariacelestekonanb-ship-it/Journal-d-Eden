import { ReportService } from "../services/report.service";
import type { Report } from "../types/report.types";
import type { ReportFormValues } from "../validation/report.schema";

export async function updateReportAction(id: string, values: ReportFormValues): Promise<Report> {
  return ReportService.update(id, values);
}
