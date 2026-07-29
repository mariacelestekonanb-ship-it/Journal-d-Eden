import { ReportService } from "../services/report.service";
import type { ReportComment, ReportParticipant } from "../types/report.types";

export async function addCommentAction(
  reportId: string,
  author: ReportParticipant,
  message: string,
): Promise<ReportComment> {
  return ReportService.addComment(reportId, author, message);
}
