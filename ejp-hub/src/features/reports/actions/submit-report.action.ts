import { ReportService } from "../services/report.service";
import type { Report } from "../types/report.types";

export async function submitReportAction(id: string): Promise<Report> {
  return ReportService.submit(id);
}
