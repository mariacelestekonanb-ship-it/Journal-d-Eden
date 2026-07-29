"use client";

import * as React from "react";

import { AppCard } from "@/shared/components/app-card";
import { Input } from "@/shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Skeleton } from "@/shared/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { formatDateTime } from "@/shared/utils/format";

import { applyAdminAuditFilters, getAdminAuditModules, useAdminAuditFilters, useAdminAuditLog } from "../hooks/use-admin-audit-log";
import { AdminEmptyState } from "./admin-empty-state";

const ALL_MODULES_VALUE = "all";

/** Journal des actions notables de la plateforme — date, auteur, action, module. */
export function AdminAuditLog() {
  const { data: entries, isLoading } = useAdminAuditLog();
  const { filters, updateFilter, resetFilters, hasActiveFilters } = useAdminAuditFilters();

  const modules = React.useMemo(() => getAdminAuditModules(entries ?? []), [entries]);
  const filtered = React.useMemo(() => applyAdminAuditFilters(entries ?? [], filters), [entries, filters]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          value={filters.search}
          onChange={(event) => updateFilter("search", event.target.value)}
          placeholder="Rechercher une action, un module, une cible…"
          aria-label="Rechercher dans le journal d'administration"
          className="sm:max-w-xs"
        />

        <Select
          value={filters.module ?? ALL_MODULES_VALUE}
          onValueChange={(value) => updateFilter("module", value === ALL_MODULES_VALUE ? null : value)}
        >
          <SelectTrigger className="sm:w-48" aria-label="Filtrer par module">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_MODULES_VALUE}>Tous les modules</SelectItem>
            {modules.map((module) => (
              <SelectItem key={module} value={module}>
                {module}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="date"
          value={filters.dateFrom ?? ""}
          onChange={(event) => updateFilter("dateFrom", event.target.value || null)}
          aria-label="Depuis le"
          className="sm:w-40"
        />
        <Input
          type="date"
          value={filters.dateTo ?? ""}
          onChange={(event) => updateFilter("dateTo", event.target.value || null)}
          aria-label="Jusqu'au"
          className="sm:w-40"
        />

        {hasActiveFilters && (
          <button type="button" onClick={resetFilters} className="text-sm text-muted-foreground underline-offset-2 hover:underline">
            Réinitialiser
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <AdminEmptyState title="Aucune entrée" description="Aucune action ne correspond à ces critères pour le moment." />
      ) : (
        <AppCard className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Cible</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{formatDateTime(entry.createdAt)}</TableCell>
                  <TableCell className="text-sm text-foreground">{entry.actor?.fullName ?? "Système"}</TableCell>
                  <TableCell className="text-sm text-foreground">{entry.action}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{entry.module}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{entry.targetLabel ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AppCard>
      )}
    </div>
  );
}
