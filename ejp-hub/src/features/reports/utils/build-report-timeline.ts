import { CheckCircle2, FilePlus2, MessageSquare, Pencil, Send, XCircle } from "lucide-react";

import type { Report, ReportComment, ReportTimelineEntry } from "../types/report.types";

/**
 * Fusionne les événements du cycle de vie (création, modification,
 * soumission, validation, rejet) et les commentaires admin en une seule
 * timeline triée chronologiquement — affichée par `ReportTimeline`.
 */
export function buildReportTimeline(report: Report, comments: ReportComment[]): ReportTimelineEntry[] {
  const entries: ReportTimelineEntry[] = [
    {
      id: `${report.id}-created`,
      label: "Compte rendu créé",
      description: report.authorName,
      timestamp: report.createdAt,
      icon: FilePlus2,
    },
  ];

  if (report.updatedAt !== report.createdAt && !report.submittedAt) {
    entries.push({ id: `${report.id}-updated`, label: "Brouillon modifié", timestamp: report.updatedAt, icon: Pencil });
  }

  if (report.submittedAt) {
    entries.push({
      id: `${report.id}-submitted`,
      label: "Soumis pour validation",
      timestamp: report.submittedAt,
      icon: Send,
    });
  }

  comments.forEach((comment) => {
    entries.push({
      id: comment.id,
      label: `Commentaire de ${comment.authorName}`,
      description: comment.message,
      timestamp: comment.createdAt,
      icon: MessageSquare,
    });
  });

  if (report.status === "REJECTED") {
    entries.push({ id: `${report.id}-rejected`, label: "Compte rendu rejeté", timestamp: report.updatedAt, icon: XCircle });
  }

  if (report.validatedAt) {
    entries.push({
      id: `${report.id}-validated`,
      label: "Compte rendu validé",
      timestamp: report.validatedAt,
      icon: CheckCircle2,
    });
  }

  return entries.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}
