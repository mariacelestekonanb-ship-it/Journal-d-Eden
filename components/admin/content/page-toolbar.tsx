"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { SearchInput } from "@/components/ui/search-input";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { ADMIN_STATUSES, type AdminStatus } from "@/lib/admin/types";

const STATUS_LABELS: Record<AdminStatus, string> = {
  brouillon: "Brouillon",
  "en-relecture": "En relecture",
  "a-corriger": "À corriger",
  publie: "Publié",
  archive: "Archivé",
};

export interface PageToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  statusFilter: AdminStatus | "tous";
  onStatusFilterChange: (status: AdminStatus | "tous") => void;
  createHref: string;
  createLabel: string;
}

/**
 * Barre d'outils d'une page de liste : recherche, filtre par statut et
 * bouton de création. Un seul composant contrôlé, réutilisé par les cinq
 * modules — chaque page de liste garde son propre état de filtre côté
 * client (voir par ex. `app/admin/fiches/fiches-list.tsx`).
 */
export function PageToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  statusFilter,
  onStatusFilterChange,
  createHref,
  createLabel,
}: PageToolbarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          containerClassName="sm:max-w-xs"
        />
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filtrer par statut"
        >
          <Tag
            asButton
            active={statusFilter === "tous"}
            onClick={() => onStatusFilterChange("tous")}
          >
            Tous
          </Tag>
          {ADMIN_STATUSES.map((status) => (
            <Tag
              key={status}
              asButton
              active={statusFilter === status}
              onClick={() => onStatusFilterChange(status)}
            >
              {STATUS_LABELS[status]}
            </Tag>
          ))}
        </div>
      </div>
      <Button asChild variant="accent" className="shrink-0">
        <Link href={createHref}>
          <Plus className="size-4" aria-hidden />
          {createLabel}
        </Link>
      </Button>
    </div>
  );
}
