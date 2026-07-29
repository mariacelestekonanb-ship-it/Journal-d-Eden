"use client";

import * as React from "react";

import { EMPTY_NOTIFICATION_FILTERS, type Notification, type NotificationFilters } from "../types/notification.types";

/** État des filtres combinables (recherche, type, priorité, lu/non lu, période). */
export function useNotificationsFilters() {
  const [filters, setFilters] = React.useState<NotificationFilters>(EMPTY_NOTIFICATION_FILTERS);

  const updateFilter = React.useCallback(<K extends keyof NotificationFilters>(key: K, value: NotificationFilters[K]) => {
    setFilters((previous) => ({ ...previous, [key]: value }));
  }, []);

  const resetFilters = React.useCallback(() => setFilters(EMPTY_NOTIFICATION_FILTERS), []);

  const hasActiveFilters = React.useMemo(
    () =>
      filters.search !== "" ||
      filters.type !== null ||
      filters.priority !== null ||
      filters.readStatus !== "all" ||
      filters.dateFrom !== null ||
      filters.dateTo !== null,
    [filters],
  );

  return { filters, updateFilter, resetFilters, hasActiveFilters };
}

/** Applique la recherche et tous les filtres combinés — fonction pure, testable indépendamment. */
export function applyNotificationFilters(notifications: Notification[], filters: NotificationFilters): Notification[] {
  const search = filters.search.trim().toLowerCase();

  return notifications.filter((notification) => {
    if (search) {
      const haystack = `${notification.title} ${notification.message}`.toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    if (filters.type && notification.type !== filters.type) return false;
    if (filters.priority && notification.priority !== filters.priority) return false;
    if (filters.readStatus === "read" && !notification.isRead) return false;
    if (filters.readStatus === "unread" && notification.isRead) return false;
    if (filters.dateFrom && notification.createdAt.slice(0, 10) < filters.dateFrom) return false;
    if (filters.dateTo && notification.createdAt.slice(0, 10) > filters.dateTo) return false;
    return true;
  });
}
