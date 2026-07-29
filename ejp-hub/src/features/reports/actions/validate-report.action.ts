import { ReportService } from "../services/report.service";
import type { Report } from "../types/report.types";

export async function validateReportAction(id: string): Promise<Report> {
  return ReportService.validate(id);
}
