"use client";

import { useQuery } from "@tanstack/react-query";
import * as React from "react";

import { AdminAuditService } from "../services/admin-audit.service";
import { EMPTY_ADMIN_AUDIT_FILTERS, type AdminAuditFilters, type AuditLogEntry } from "../types/admin.types";

export const ADMIN_AUDIT_LOG_KEY = ["admin", "audit-log"] as const;

export function useAdminAuditLog() {
  return useQuery({
    queryKey: ADMIN_AUDIT_LOG_KEY,
    queryFn: () => AdminAuditService.list(),
  });
}

/** État des filtres combinables du journal — même approche que `useNotificationsFilters`. */
export function useAdminAuditFilters() {
  const [filters, setFilters] = React.useState<AdminAuditFilters>(EMPTY_ADMIN_AUDIT_FILTERS);

  const updateFilter = React.useCallback(<K extends keyof AdminAuditFilters>(key: K, value: AdminAuditFilters[K]) => {
    setFilters((previous) => ({ ...previous, [key]: value }));
  }, []);

  const resetFilters = React.useCallback(() => setFilters(EMPTY_ADMIN_AUDIT_FILTERS), []);

  const hasActiveFilters = React.useMemo(
    () => filters.search !== "" || filters.module !== null || filters.dateFrom !== null || filters.dateTo !== null,
    [filters],
  );

  return { filters, updateFilter, resetFilters, hasActiveFilters };
}

/** Filtre en mémoire — fonction pure, testable indépendamment (même contrat que `applyNotificationFilters`). */
export function applyAdminAuditFilters(entries: AuditLogEntry[], filters: AdminAuditFilters): AuditLogEntry[] {
  const search = filters.search.trim().toLowerCase();

  return entries.filter((entry) => {
    if (search) {
      const haystack = `${entry.action} ${entry.module} ${entry.targetLabel ?? ""} ${entry.actor?.fullName ?? ""}`.toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    if (filters.module && entry.module !== filters.module) return false;
    if (filters.dateFrom && entry.createdAt.slice(0, 10) < filters.dateFrom) return false;
    if (filters.dateTo && entry.createdAt.slice(0, 10) > filters.dateTo) return false;
    return true;
  });
}

/** Modules distincts présents dans le journal — alimente le filtre sans liste figée en dur. */
export function getAdminAuditModules(entries: AuditLogEntry[]): string[] {
  return Array.from(new Set(entries.map((entry) => entry.module))).sort((a, b) => a.localeCompare(b, "fr"));
}
