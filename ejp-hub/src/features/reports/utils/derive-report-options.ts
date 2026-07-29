import type { Report, ReportParticipant } from "../types/report.types";

/** Options de filtre dérivées des CR déjà chargés — pas de requête dédiée pour une simple liste de valeurs distinctes. */
export function deriveLeaderOptions(reports: Report[]): ReportParticipant[] {
  const byId = new Map<string, ReportParticipant>();
  reports.forEach((report) => byId.set(report.leader.id, report.leader));
  return Array.from(byId.values());
}

export function deriveAuthorOptions(reports: Report[]): ReportParticipant[] {
  const byId = new Map<string, ReportParticipant>();
  reports.forEach((report) => byId.set(report.authorId, { id: report.authorId, fullName: report.authorName }));
  return Array.from(byId.values());
}
