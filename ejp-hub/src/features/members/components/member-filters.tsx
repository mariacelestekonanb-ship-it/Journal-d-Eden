"use client";

import { Search, X } from "lucide-react";

import { AppButton } from "@/shared/components/app-button";
import { ROLES, ROLE_LABELS } from "@/shared/constants/roles";
import { Input } from "@/shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";

import type { MemberFilters as MemberFiltersValue } from "../types/member.types";
import { MEMBER_STATUS_LABELS, MEMBER_STATUS_OPTIONS } from "../utils/member-status";

export interface MemberFiltersProps {
  filters: MemberFiltersValue;
  onChange: <K extends keyof MemberFiltersValue>(key: K, value: MemberFiltersValue[K]) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

const ALL_VALUE = "__all__";

/** Filtres combinables des Membres : recherche, statut, rôle. */
export function MemberFilters({ filters, onChange, onReset, hasActiveFilters }: MemberFiltersProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.search}
          onChange={(event) => onChange("search", event.target.value)}
          placeholder="Rechercher un nom, un e-mail, un téléphone…"
          className="pl-9"
          aria-label="Rechercher un membre"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Select
          value={filters.status ?? ALL_VALUE}
          onValueChange={(value) => onChange("status", value === ALL_VALUE ? null : (value as MemberFiltersValue["status"]))}
        >
          <SelectTrigger aria-label="Filtrer par statut">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>Tous les statuts</SelectItem>
            {MEMBER_STATUS_OPTIONS.map((status) => (
              <SelectItem key={status} value={status}>
                {MEMBER_STATUS_LABELS[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.role ?? ALL_VALUE}
          onValueChange={(value) => onChange("role", value === ALL_VALUE ? null : (value as MemberFiltersValue["role"]))}
        >
          <SelectTrigger aria-label="Filtrer par rôle">
            <SelectValue placeholder="Rôle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>Tous les rôles</SelectItem>
            {ROLES.map((role) => (
              <SelectItem key={role} value={role}>
                {ROLE_LABELS[role]}
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
