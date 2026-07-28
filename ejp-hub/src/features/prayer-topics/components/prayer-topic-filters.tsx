"use client";

import { Search, X } from "lucide-react";

import { AppButton } from "@/shared/components/app-button";
import { Input } from "@/shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";

import { usePrayerTopicAuthorOptions } from "../hooks/use-prayer-topics";
import type { PrayerTopicFilters as PrayerTopicFiltersValue } from "../types/prayer-topic.types";
import { PRAYER_TOPIC_CATEGORY_CONFIG, PRAYER_TOPIC_CATEGORY_OPTIONS } from "../utils/prayer-topic-category";
import { PRAYER_TOPIC_PRIORITY_CONFIG, PRAYER_TOPIC_PRIORITY_OPTIONS } from "../utils/prayer-topic-priority";
import { PRAYER_TOPIC_STATUS_LABELS, PRAYER_TOPIC_STATUS_OPTIONS } from "../utils/prayer-topic-status";

export interface PrayerTopicFiltersProps {
  filters: PrayerTopicFiltersValue;
  onChange: <K extends keyof PrayerTopicFiltersValue>(key: K, value: PrayerTopicFiltersValue[K]) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

const ALL_VALUE = "__all__";

/** Recherche avancée (titre, description, auteur, catégorie) et filtres combinables. */
export function PrayerTopicFilters({ filters, onChange, onReset, hasActiveFilters }: PrayerTopicFiltersProps) {
  const { data: authors } = usePrayerTopicAuthorOptions();

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.search}
          onChange={(event) => onChange("search", event.target.value)}
          placeholder="Rechercher un titre, une description, un auteur…"
          className="pl-9"
          aria-label="Rechercher un sujet de prière"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Select
          value={filters.category ?? ALL_VALUE}
          onValueChange={(value) => onChange("category", value === ALL_VALUE ? null : (value as PrayerTopicFiltersValue["category"]))}
        >
          <SelectTrigger aria-label="Filtrer par catégorie">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>Toutes les catégories</SelectItem>
            {PRAYER_TOPIC_CATEGORY_OPTIONS.map((category) => (
              <SelectItem key={category} value={category}>
                {PRAYER_TOPIC_CATEGORY_CONFIG[category].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.priority ?? ALL_VALUE}
          onValueChange={(value) => onChange("priority", value === ALL_VALUE ? null : (value as PrayerTopicFiltersValue["priority"]))}
        >
          <SelectTrigger aria-label="Filtrer par priorité">
            <SelectValue placeholder="Priorité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>Toutes les priorités</SelectItem>
            {PRAYER_TOPIC_PRIORITY_OPTIONS.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {PRAYER_TOPIC_PRIORITY_CONFIG[priority].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.status ?? ALL_VALUE}
          onValueChange={(value) => onChange("status", value === ALL_VALUE ? null : (value as PrayerTopicFiltersValue["status"]))}
        >
          <SelectTrigger aria-label="Filtrer par statut">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>Tous les statuts</SelectItem>
            {PRAYER_TOPIC_STATUS_OPTIONS.map((status) => (
              <SelectItem key={status} value={status}>
                {PRAYER_TOPIC_STATUS_LABELS[status]}
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
            {authors?.map((author) => (
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
          aria-label="Date de début après"
        />
        <Input
          type="date"
          value={filters.dateTo ?? ""}
          onChange={(event) => onChange("dateTo", event.target.value || null)}
          aria-label="Date de début avant"
        />
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
