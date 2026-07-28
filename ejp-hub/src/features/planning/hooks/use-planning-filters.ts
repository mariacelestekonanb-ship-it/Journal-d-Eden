"use client";

import * as React from "react";

import { EMPTY_PLANNING_FILTERS, type PlanningFilters, type PrayerSlot } from "../types/planning.types";

/** État des filtres combinables (recherche, date, conducteur, lieu, statut, sujet). */
export function usePlanningFilters() {
  const [filters, setFilters] = React.useState<PlanningFilters>(EMPTY_PLANNING_FILTERS);

  const updateFilter = React.useCallback(
    <K extends keyof PlanningFilters>(key: K, value: PlanningFilters[K]) => {
      setFilters((previous) => ({ ...previous, [key]: value }));
    },
    [],
  );

  const resetFilters = React.useCallback(() => setFilters(EMPTY_PLANNING_FILTERS), []);

  const hasActiveFilters = React.useMemo(
    () =>
      filters.search !== "" ||
      filters.dateFrom !== null ||
      filters.dateTo !== null ||
      filters.leaderId !== null ||
      filters.location !== null ||
      filters.status !== null ||
      filters.prayerTopicId !== null,
    [filters],
  );

  return { filters, updateFilter, resetFilters, hasActiveFilters };
}

/** Applique tous les filtres combinés à la liste de créneaux — fonction pure, testable indépendamment. */
export function applyPlanningFilters(slots: PrayerSlot[], filters: PlanningFilters): PrayerSlot[] {
  const search = filters.search.trim().toLowerCase();

  return slots.filter((slot) => {
    if (search) {
      const haystack = `${slot.title} ${slot.description ?? ""} ${slot.location ?? ""}`.toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    if (filters.dateFrom && slot.date < filters.dateFrom) return false;
    if (filters.dateTo && slot.date > filters.dateTo) return false;
    if (
      filters.leaderId &&
      slot.primaryLeader?.id !== filters.leaderId &&
      slot.secondaryLeader?.id !== filters.leaderId
    ) {
      return false;
    }
    if (filters.location && slot.location !== filters.location) return false;
    if (filters.status && slot.status !== filters.status) return false;
    if (filters.prayerTopicId && slot.prayerTopic?.id !== filters.prayerTopicId) return false;
    return true;
  });
}
