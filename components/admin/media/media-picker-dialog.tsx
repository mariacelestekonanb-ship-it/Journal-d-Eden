"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { SearchInput } from "@/components/ui/search-input";
import { Tag } from "@/components/ui/tag";
import { EmptyState } from "@/components/ui/empty-state";
import { Heading } from "@/components/ui/heading";
import {
  MEDIA_TYPE_ICONS,
  MEDIA_TYPE_LABELS,
  formatTailleMedia,
} from "@/lib/admin/media";
import { mediaAssets } from "@/lib/admin/media";
import type { MediaAsset, MediaType } from "@/lib/admin/types";

export interface MediaPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (asset: MediaAsset) => void;
  /** Restreint la sélection à certains types (ex. uniquement images/illustrations pour un bloc image). */
  allowedTypes?: MediaType[];
}

/**
 * Sélecteur de média : parcourt la médiathèque (`lib/admin/media.ts`) pour
 * choisir une image sans taper d'URL à la main — réutilisé par le bloc
 * « Image » de l'éditeur riche et par `CoverImageField` (image de
 * couverture). Même recherche/filtres que `MediaGallery`, dans une
 * fenêtre modale plutôt qu'une page dédiée.
 */
export function MediaPickerDialog({
  open,
  onOpenChange,
  onSelect,
  allowedTypes,
}: MediaPickerDialogProps) {
  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<MediaType | "tous">(
    "tous",
  );

  const assets = allowedTypes
    ? mediaAssets.filter((asset) => allowedTypes.includes(asset.type))
    : mediaAssets;
  const types = allowedTypes ?? (Object.keys(MEDIA_TYPE_LABELS) as MediaType[]);

  const filtered = assets.filter((asset) => {
    const matchType = typeFilter === "tous" || asset.type === typeFilter;
    const matchSearch = asset.nom
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    return matchType && matchSearch;
  });

  function handleSelect(asset: MediaAsset) {
    onSelect(asset);
    onOpenChange(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-navy-950/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 backdrop-blur-sm" />
        <Dialog.Content className="border-border bg-card data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-1/2 left-1/2 z-50 flex max-h-[min(38rem,80vh)] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl border shadow-xl">
          <div className="flex items-center justify-between gap-3 p-5 pb-0">
            <Dialog.Title asChild>
              <Heading as="h2" size="sm">
                Choisir un média
              </Heading>
            </Dialog.Title>
            <Dialog.Close className="text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:ring-ring flex size-9 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none">
              <X className="size-4" />
              <span className="sr-only">Fermer</span>
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">
            Rechercher et sélectionner une image depuis la médiathèque.
          </Dialog.Description>

          <div className="flex flex-col gap-3 p-5 pb-3">
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un fichier…"
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
              {types.map((type) => (
                <Tag
                  key={type}
                  asButton
                  active={typeFilter === type}
                  onClick={() => setTypeFilter(type)}
                >
                  {MEDIA_TYPE_LABELS[type]}
                </Tag>
              ))}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
            {filtered.length === 0 ? (
              <EmptyState
                title="Aucun fichier"
                description="Aucun fichier ne correspond à ces filtres."
                className="border-none bg-transparent py-10"
              />
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {filtered.map((asset) => {
                  const Icon = MEDIA_TYPE_ICONS[asset.type];
                  return (
                    <button
                      key={asset.id}
                      type="button"
                      onClick={() => handleSelect(asset)}
                      className="border-border bg-background hover:border-ring focus-visible:ring-ring flex flex-col overflow-hidden rounded-xl border text-left transition-colors focus-visible:ring-2 focus-visible:outline-none"
                    >
                      <div className="bg-muted/50 text-muted-foreground flex aspect-square items-center justify-center">
                        <Icon className="size-7" aria-hidden />
                      </div>
                      <div className="space-y-0.5 p-2.5">
                        <p
                          className="truncate text-xs font-medium"
                          title={asset.nom}
                        >
                          {asset.nom}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {formatTailleMedia(asset.tailleKo)}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
