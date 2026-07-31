import { format, startOfMonth, subMonths } from "date-fns";
import { fr } from "date-fns/locale";

import type { Report, ReportStatsSummary } from "../types/report.types";

const EVOLUTION_MONTHS = 6;

function computeEvolution(reports: Report[]): { label: string; count: number }[] {
  const now = new Date();
  const months = Array.from({ length: EVOLUTION_MONTHS }, (_, index) =>
    startOfMonth(subMonths(now, EVOLUTION_MONTHS - 1 - index)),
  );

  return months.map((monthStart) => {
    const monthKey = format(monthStart, "yyyy-MM");
    const count = reports.filter((report) => report.createdAt.slice(0, 7) === monthKey).length;
    return { label: format(monthStart, "MMM", { locale: fr }), count };
  });
}

function computeAverageValidationHours(reports: Report[]): number | null {
  const durations = reports
    .filter((report): report is Report & { submittedAt: string; validatedAt: string } =>
      Boolean(report.status === "VALIDATED" && report.submittedAt && report.validatedAt),
    )
    .map((report) => (new Date(report.validatedAt).getTime() - new Date(report.submittedAt).getTime()) / 3_600_000);

  if (durations.length === 0) return null;
  return Math.round((durations.reduce((sum, hours) => sum + hours, 0) / durations.length) * 10) / 10;
}

/** Calcule les indicateurs du module à partir d'un jeu de CR déjà en cache — pur, aucun appel réseau. */
export function computeReportStats(reports: Report[]): ReportStatsSummary {
  return {
    pendingCount: reports.filter((report) => report.status === "SUBMITTED").length,
    validatedCount: reports.filter((report) => report.status === "VALIDATED").length,
    rejectedCount: reports.filter((report) => report.status === "REJECTED").length,
    draftCount: reports.filter((report) => report.status === "DRAFT").length,
    averageValidationHours: computeAverageValidationHours(reports),
    evolution: computeEvolution(reports),
  };
}
