"use client";

import { Search, X } from "lucide-react";

import { AppButton } from "@/shared/components/app-button";
import { AppCard } from "@/shared/components/app-card";
import { Input } from "@/shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";

import type { NotificationFilters as NotificationFiltersValue, NotificationReadFilter } from "../types/notification.types";
import { NOTIFICATION_PRIORITY_LABELS, NOTIFICATION_PRIORITY_OPTIONS } from "../utils/notification-priority";
import { NOTIFICATION_TYPE_LABELS, NOTIFICATION_TYPE_OPTIONS } from "../utils/notification-type";

export interface NotificationFiltersProps {
  filters: NotificationFiltersValue;
  onChange: <K extends keyof NotificationFiltersValue>(key: K, value: NotificationFiltersValue[K]) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

const ALL_VALUE = "__all__";

const READ_STATUS_LABELS: Record<NotificationReadFilter, string> = {
  all: "Toutes",
  read: "Lues",
  unread: "Non lues",
};

/** Filtres combinables des Notifications : recherche, type, priorité, lu/non lu, période. */
export function NotificationFilters({ filters, onChange, onReset, hasActiveFilters }: NotificationFiltersProps) {
  return (
    <AppCard className="flex flex-col gap-3 p-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.search}
          onChange={(event) => onChange("search", event.target.value)}
          placeholder="Rechercher un titre, un message…"
          className="pl-9"
          aria-label="Rechercher une notification"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Select
          value={filters.type ?? ALL_VALUE}
          onValueChange={(value) => onChange("type", value === ALL_VALUE ? null : (value as NotificationFiltersValue["type"]))}
        >
          <SelectTrigger aria-label="Filtrer par type">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>Tous les types</SelectItem>
            {NOTIFICATION_TYPE_OPTIONS.map((type) => (
              <SelectItem key={type} value={type}>
                {NOTIFICATION_TYPE_LABELS[type]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.priority ?? ALL_VALUE}
          onValueChange={(value) =>
            onChange("priority", value === ALL_VALUE ? null : (value as NotificationFiltersValue["priority"]))
          }
        >
          <SelectTrigger aria-label="Filtrer par priorité">
            <SelectValue placeholder="Priorité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>Toutes priorités</SelectItem>
            {NOTIFICATION_PRIORITY_OPTIONS.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {NOTIFICATION_PRIORITY_LABELS[priority]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.readStatus}
          onValueChange={(value) => onChange("readStatus", value as NotificationReadFilter)}
        >
          <SelectTrigger aria-label="Filtrer par statut de lecture">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(READ_STATUS_LABELS) as NotificationReadFilter[]).map((status) => (
              <SelectItem key={status} value={status}>
                {READ_STATUS_LABELS[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="date"
          value={filters.dateFrom ?? ""}
          onChange={(event) => onChange("dateFrom", event.target.value || null)}
          aria-label="Depuis le"
        />
        <Input
          type="date"
          value={filters.dateTo ?? ""}
          onChange={(event) => onChange("dateTo", event.target.value || null)}
          aria-label="Jusqu'au"
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
