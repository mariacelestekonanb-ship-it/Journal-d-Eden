import { ReportService } from "../services/report.service";

export async function deleteReportAction(id: string): Promise<void> {
  return ReportService.remove(id);
}
