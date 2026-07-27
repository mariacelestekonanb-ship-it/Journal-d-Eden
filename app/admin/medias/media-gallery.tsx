"use client";

import * as React from "react";
import {
  Image as ImageIcon,
  Shapes,
  FileText,
  File,
  Palette,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";

import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { SearchInput } from "@/components/ui/search-input";
import { Tag } from "@/components/ui/tag";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/format";
import type { MediaAsset, MediaType } from "@/lib/admin/types";

export interface MediaGalleryProps {
  items: MediaAsset[];
}

const TYPE_LABELS: Record<MediaType, string> = {
  image: "Images",
  logo: "Logos",
  pdf: "PDF",
  document: "Documents",
  illustration: "Illustrations",
};

const TYPE_ICONS: Record<MediaType, LucideIcon> = {
  image: ImageIcon,
  logo: Shapes,
  pdf: FileText,
  document: File,
  illustration: Palette,
};

function formatTaille(ko: number): string {
  if (ko < 1024) return `${ko} Ko`;
  return `${(ko / 1024).toFixed(1)} Mo`;
}

/**
 * Médiathèque : recherche et filtres par type sur les ressources
 * médias. Aucun stockage réel n'est connecté (voir `lib/admin/media.ts`) —
 * les vignettes affichent une icône par type plutôt qu'un aperçu chargé
 * depuis une URL qui n'existe pas encore réellement.
 */
export function MediaGallery({ items }: MediaGalleryProps) {
  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<MediaType | "tous">(
    "tous",
  );

  const filtered = items.filter((item) => {
    const matchType = typeFilter === "tous" || item.type === typeFilter;
    const matchSearch = item.nom
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <Heading as="h1" size="lg">
          Médiathèque
        </Heading>
        <Paragraph tone="muted" className="mt-1">
          Images, logos, documents et illustrations utilisés sur LexWatch.
        </Paragraph>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un fichier…"
          containerClassName="sm:max-w-xs"
        />
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filtrer par type"
        >
          <Tag
            asButton
            active={typeFilter === "tous"}
            onClick={() => setTypeFilter("tous")}
          >
            Tous
          </Tag>
          {(Object.keys(TYPE_LABELS) as MediaType[]).map((type) => (
            <Tag
              key={type}
              asButton
              active={typeFilter === type}
              onClick={() => setTypeFilter(type)}
            >
              {TYPE_LABELS[type]}
            </Tag>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="Aucun fichier"
          description="Aucun fichier ne correspond à ces filtres."
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((item) => {
            const Icon = TYPE_ICONS[item.type];
            return (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="border-border bg-card hover:border-ring group relative flex flex-col overflow-hidden rounded-2xl border transition-colors"
              >
                <div className="bg-muted/50 text-muted-foreground group-hover:text-foreground relative flex aspect-square items-center justify-center transition-colors">
                  <Icon className="size-8" aria-hidden />
                  <ExternalLink
                    aria-hidden
                    className="absolute top-2 right-2 size-3.5 opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </div>
                <div className="space-y-1 p-3">
                  <p className="truncate text-sm font-medium" title={item.nom}>
                    {item.nom}
                  </p>
                  <p className="text-muted-foreground flex items-center justify-between text-xs">
                    <span>{formatTaille(item.tailleKo)}</span>
                    <span>{formatDate(item.ajouteLe)}</span>
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
