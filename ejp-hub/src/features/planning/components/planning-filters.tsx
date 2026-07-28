"use client";

import { Search, X } from "lucide-react";

import { AppButton } from "@/shared/components/app-button";
import { Input } from "@/shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";

import { usePlanningLeaderOptions, usePlanningLocationOptions, usePlanningPrayerTopicOptions } from "../hooks/use-planning-slots";
import type { PlanningFilters as PlanningFiltersValue } from "../types/planning.types";
import { PLANNING_STATUS_LABELS, PLANNING_STATUS_OPTIONS } from "../utils/planning-status";

export interface PlanningFiltersProps {
  filters: PlanningFiltersValue;
  onChange: <K extends keyof PlanningFiltersValue>(key: K, value: PlanningFiltersValue[K]) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

const ALL_VALUE = "__all__";

/** Filtres combinables du Planning : recherche, période, conducteur, lieu, statut, sujet. */
export function PlanningFilters({ filters, onChange, onReset, hasActiveFilters }: PlanningFiltersProps) {
  const { data: leaders } = usePlanningLeaderOptions();
  const { data: locations } = usePlanningLocationOptions();
  const { data: topics } = usePlanningPrayerTopicOptions();

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.search}
          onChange={(event) => onChange("search", event.target.value)}
          placeholder="Rechercher un créneau, un lieu…"
          className="pl-9"
          aria-label="Rechercher un créneau"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Input
          type="date"
          value={filters.dateFrom ?? ""}
          onChange={(event) => onChange("dateFrom", event.target.value || null)}
          aria-label="Date de début"
        />
        <Input
          type="date"
          value={filters.dateTo ?? ""}
          onChange={(event) => onChange("dateTo", event.target.value || null)}
          aria-label="Date de fin"
        />

        <Select value={filters.leaderId ?? ALL_VALUE} onValueChange={(value) => onChange("leaderId", value === ALL_VALUE ? null : value)}>
          <SelectTrigger aria-label="Filtrer par conducteur">
            <SelectValue placeholder="Conducteur" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>Tous les conducteurs</SelectItem>
            {leaders?.map((leader) => (
              <SelectItem key={leader.id} value={leader.id}>
                {leader.fullName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.location ?? ALL_VALUE} onValueChange={(value) => onChange("location", value === ALL_VALUE ? null : value)}>
          <SelectTrigger aria-label="Filtrer par lieu">
            <SelectValue placeholder="Lieu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>Tous les lieux</SelectItem>
            {locations?.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.status ?? ALL_VALUE}
          onValueChange={(value) => onChange("status", value === ALL_VALUE ? null : (value as PlanningFiltersValue["status"]))}
        >
          <SelectTrigger aria-label="Filtrer par statut">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>Tous les statuts</SelectItem>
            {PLANNING_STATUS_OPTIONS.map((status) => (
              <SelectItem key={status} value={status}>
                {PLANNING_STATUS_LABELS[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.prayerTopicId ?? ALL_VALUE}
          onValueChange={(value) => onChange("prayerTopicId", value === ALL_VALUE ? null : value)}
        >
          <SelectTrigger aria-label="Filtrer par sujet de prière">
            <SelectValue placeholder="Sujet de prière" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>Tous les sujets</SelectItem>
            {topics?.map((topic) => (
              <SelectItem key={topic.id} value={topic.id}>
                {topic.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <AppButton variant="ghost" size="sm" className="w-fit" onClick={onReset}>
          <X className="size-4" />
          Réinitialiser les filtres
        </AppButton>
      )}
    </div>
  );
}
