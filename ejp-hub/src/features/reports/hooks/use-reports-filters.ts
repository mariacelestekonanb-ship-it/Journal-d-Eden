"use client";

import * as React from "react";

import { EMPTY_REPORT_FILTERS, type Report, type ReportFilters } from "../types/report.types";

/** État des filtres combinables (recherche, statut, conducteur, auteur, période). */
export function useReportsFilters() {
  const [filters, setFilters] = React.useState<ReportFilters>(EMPTY_REPORT_FILTERS);

  const updateFilter = React.useCallback(<K extends keyof ReportFilters>(key: K, value: ReportFilters[K]) => {
    setFilters((previous) => ({ ...previous, [key]: value }));
  }, []);

  const resetFilters = React.useCallback(() => setFilters(EMPTY_REPORT_FILTERS), []);

  const hasActiveFilters = React.useMemo(
    () =>
      filters.search !== "" ||
      filters.status !== null ||
      filters.leaderId !== null ||
      filters.authorId !== null ||
      filters.dateFrom !== null ||
      filters.dateTo !== null,
    [filters],
  );

  return { filters, updateFilter, resetFilters, hasActiveFilters };
}

/** Applique la recherche et tous les filtres combinés — fonction pure, testable indépendamment. */
export function applyReportFilters(reports: Report[], filters: ReportFilters): Report[] {
  const search = filters.search.trim().toLowerCase();

  return reports.filter((report) => {
    if (search) {
      const haystack = `${report.planningSlot.title} ${report.leader.fullName} ${report.authorName} ${report.announcements} ${report.prayerPoints.map((point) => point.title).join(" ")}`.toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    if (filters.status && report.status !== filters.status) return false;
    if (filters.leaderId && report.leader.id !== filters.leaderId) return false;
    if (filters.authorId && report.authorId !== filters.authorId) return false;
    if (filters.dateFrom && report.planningSlot.date < filters.dateFrom) return false;
    if (filters.dateTo && report.planningSlot.date > filters.dateTo) return false;
    return true;
  });
}
