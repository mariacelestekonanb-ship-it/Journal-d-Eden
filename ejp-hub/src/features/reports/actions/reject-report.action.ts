import { ReportService } from "../services/report.service";
import type { Report } from "../types/report.types";

export async function rejectReportAction(id: string): Promise<Report> {
  return ReportService.reject(id);
}
