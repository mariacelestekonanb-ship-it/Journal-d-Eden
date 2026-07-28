"use client";

import * as React from "react";

import { PrayerTopicSearchService } from "../services/prayer-topic-search.service";
import { EMPTY_PRAYER_TOPIC_FILTERS, type PrayerTopic, type PrayerTopicFilters } from "../types/prayer-topic.types";

/** État des filtres combinables (recherche, catégorie, priorité, statut, auteur, période). */
export function usePrayerTopicsFilters() {
  const [filters, setFilters] = React.useState<PrayerTopicFilters>(EMPTY_PRAYER_TOPIC_FILTERS);

  const updateFilter = React.useCallback(
    <K extends keyof PrayerTopicFilters>(key: K, value: PrayerTopicFilters[K]) => {
      setFilters((previous) => ({ ...previous, [key]: value }));
    },
    [],
  );

  const resetFilters = React.useCallback(() => setFilters(EMPTY_PRAYER_TOPIC_FILTERS), []);

  const hasActiveFilters = React.useMemo(
    () =>
      filters.search !== "" ||
      filters.category !== null ||
      filters.priority !== null ||
      filters.status !== null ||
      filters.authorId !== null ||
      filters.dateFrom !== null ||
      filters.dateTo !== null,
    [filters],
  );

  return { filters, updateFilter, resetFilters, hasActiveFilters };
}

/** Applique la recherche et tous les filtres combinés — délègue à `PrayerTopicSearchService`. */
export function applyPrayerTopicFilters(topics: PrayerTopic[], filters: PrayerTopicFilters): PrayerTopic[] {
  return PrayerTopicSearchService.search(topics, filters);
}
