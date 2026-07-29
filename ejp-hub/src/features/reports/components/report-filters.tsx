"use client";

import { Search, X } from "lucide-react";

import { AppButton } from "@/shared/components/app-button";
import { AppCard } from "@/shared/components/app-card";
import { Input } from "@/shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";

import type { ReportFilters as ReportFiltersValue, ReportParticipant } from "../types/report.types";
import { REPORT_STATUS_LABELS, REPORT_STATUS_OPTIONS } from "../utils/report-status";

export interface ReportFiltersProps {
  filters: ReportFiltersValue;
  onChange: <K extends keyof ReportFiltersValue>(key: K, value: ReportFiltersValue[K]) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
  leaderOptions: ReportParticipant[];
  authorOptions: ReportParticipant[];
}

const ALL_VALUE = "__all__";

/** Filtres combinables des Comptes rendus : recherche, statut, conducteur, auteur, période. */
export function ReportFilters({
  filters,
  onChange,
  onReset,
  hasActiveFilters,
  leaderOptions,
  authorOptions,
}: ReportFiltersProps) {
  return (
    <AppCard className="flex flex-col gap-3 p-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.search}
          onChange={(event) => onChange("search", event.target.value)}
          placeholder="Rechercher un créneau, un conducteur, un point de prière…"
          className="pl-9"
          aria-label="Rechercher un compte rendu"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Select
          value={filters.status ?? ALL_VALUE}
          onValueChange={(value) => onChange("status", value === ALL_VALUE ? null : (value as ReportFiltersValue["status"]))}
        >
          <SelectTrigger aria-label="Filtrer par statut">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>Tous les statuts</SelectItem>
            {REPORT_STATUS_OPTIONS.map((status) => (
              <SelectItem key={status} value={status}>
                {REPORT_STATUS_LABELS[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.leaderId ?? ALL_VALUE} onValueChange={(value) => onChange("leaderId", value === ALL_VALUE ? null : value)}>
          <SelectTrigger aria-label="Filtrer par conducteur">
            <SelectValue placeholder="Conducteur" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>Tous les conducteurs</SelectItem>
            {leaderOptions.map((leader) => (
              <SelectItem key={leader.id} value={leader.id}>
                {leader.fullName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.authorId ?? ALL_VALUE} onValueChange={(value) => onChange("authorId", value === ALL_VALUE ? null : value)}>
          <SelectTrigger aria-label="Filtrer par auteur">
            <SelectValue placeholder="Auteur" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>Tous les auteurs</SelectItem>
            {authorOptions.map((author) => (
              <SelectItem key={author.id} value={author.id}>
                {author.fullName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="date"
          value={filters.dateFrom ?? ""}
          onChange={(event) => onChange("dateFrom", event.target.value || null)}
          aria-label="Date de créneau après"
        />
        <Input
          type="date"
          value={filters.dateTo ?? ""}
          onChange={(event) => onChange("dateTo", event.target.value || null)}
          aria-label="Date de créneau avant"
        />
      </div>

      {hasActiveFilters && (
        <AppButton variant="ghost" size="sm" className="w-fit" onClick={onReset}>
          <X className="size-4" />
          Réinitialiser les filtres
        </AppButton>
      )}
    </AppCard>
  );
}
