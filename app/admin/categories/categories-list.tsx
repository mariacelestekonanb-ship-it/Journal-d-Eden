"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronUp, ChevronDown, Merge, Pencil, Plus } from "lucide-react";

import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import {
  ContentTable,
  type ContentTableColumn,
} from "@/components/admin/content/content-table";
import { StatusBadge } from "@/components/admin/content/status-badge";
import { RowActionsMenu } from "@/components/admin/content/row-actions-menu";
import { MergeDialog } from "@/components/admin/content/merge-dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { CategoryDialog } from "@/components/admin/categories/category-dialog";
import {
  mergeCategories,
  reorderCategorie,
  saveCategorie,
  type CategorieFormInput,
} from "@/lib/admin/categories-actions";
import { formatDate, labelDomaine } from "@/lib/format";
import type { CategorieAdmin } from "@/lib/admin/types";

export interface CategoriesListProps {
  items: CategorieAdmin[];
}

const CATEGORIE_VIDE: CategorieFormInput = {
  titre: "",
  description: "",
  domaine: "droit-spatial",
  icone: "",
};

/**
 * Module Catégories : une seule page (pas de route de détail dédiée — voir
 * `lib/admin/content.ts`). Créer/renommer se font via une modale légère,
 * fusionner via `MergeDialog`, archiver/supprimer via `RowActionsMenu`, et
 * réorganiser via des boutons haut/bas qui échangent la position dans le
 * dépôt (voir `Repository.reorder`).
 */
export function CategoriesList({ items }: CategoriesListProps) {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [isPending, startTransition] = React.useTransition();
  const [createOpen, setCreateOpen] = React.useState(false);
  const [renaming, setRenaming] = React.useState<CategorieAdmin | null>(null);
  const [mergingId, setMergingId] = React.useState<string | null>(null);

  const filtered = items.filter((item) =>
    item.titre.toLowerCase().includes(search.trim().toLowerCase()),
  );

  function handleCreate(value: CategorieFormInput) {
    startTransition(async () => {
      await saveCategorie(value);
      setCreateOpen(false);
      router.refresh();
    });
  }

  function handleRename(value: CategorieFormInput) {
    if (!renaming) return;
    startTransition(async () => {
      await saveCategorie({ ...value, id: renaming.id });
      setRenaming(null);
      router.refresh();
    });
  }

  function handleMergeConfirm(targetId: string) {
    if (!mergingId) return;
    startTransition(async () => {
      await mergeCategories(mergingId, targetId);
      setMergingId(null);
      router.refresh();
    });
  }

  function handleReorder(id: string, direction: -1 | 1) {
    startTransition(async () => {
      await reorderCategorie(id, direction);
      router.refresh();
    });
  }

  const columns: ContentTableColumn<CategorieAdmin>[] = [
    {
      header: "",
      className: "w-16",
      render: (item) => {
        const index = items.findIndex((i) => i.id === item.id);
        return (
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              disabled={index === 0 || isPending}
              onClick={() => handleReorder(item.id, -1)}
              aria-label={`Déplacer ${item.titre} vers le haut`}
            >
              <ChevronUp className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              disabled={index === items.length - 1 || isPending}
              onClick={() => handleReorder(item.id, 1)}
              aria-label={`Déplacer ${item.titre} vers le bas`}
            >
              <ChevronDown className="size-3.5" />
            </Button>
          </div>
        );
      },
    },
    {
      header: "Titre",
      render: (item) => (
        <div>
          <p className="font-medium">{item.titre}</p>
          <p className="text-muted-foreground line-clamp-1 text-xs">
            {item.description}
          </p>
        </div>
      ),
    },
    {
      header: "Domaine",
      render: (item) => (
        <Badge variant="outline">{labelDomaine(item.domaine)}</Badge>
      ),
    },
    {
      header: "Articles",
      render: (item) => item.nombreArticles,
      className: "text-center",
    },
    {
      header: "Statut",
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      header: "Mis à jour",
      render: (item) => (
        <span className="text-muted-foreground text-xs whitespace-nowrap">
          {formatDate(item.updatedAt)} · {item.updatedBy}
        </span>
      ),
    },
    {
      header: "",
      className: "text-right",
      render: (item) => (
        <RowActionsMenu
          entity="categorie"
          id={item.id}
          titre={item.titre}
          status={item.status}
          hidePublishToggle
          hideDuplicate
          extraItems={
            <>
              <DropdownMenuItem onSelect={() => setRenaming(item)}>
                <Pencil aria-hidden />
                Renommer
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setMergingId(item.id)}>
                <Merge aria-hidden />
                Fusionner
              </DropdownMenuItem>
            </>
          }
        />
      ),
    },
  ];

  const mergingCategorie = items.find((item) => item.id === mergingId);
  const mergeOptions = items
    .filter((item) => item.id !== mergingId)
    .map((item) => ({ id: item.id, label: item.titre }));

  return (
    <div className="space-y-6">
      <div>
        <Heading as="h1" size="lg">
          Catégories
        </Heading>
        <Paragraph tone="muted" className="mt-1">
          Classification fine des fiches et analyses par grand thème.
        </Paragraph>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une catégorie…"
          containerClassName="sm:max-w-xs"
        />
        <Button
          variant="accent"
          className="shrink-0"
          onClick={() => setCreateOpen(true)}
        >
          <Plus className="size-4" aria-hidden />
          Nouvelle catégorie
        </Button>
      </div>

      <ContentTable
        items={filtered}
        columns={columns}
        getRowKey={(item) => item.id}
        emptyTitle="Aucune catégorie"
        emptyDescription="Aucune catégorie ne correspond à cette recherche."
      />

      <CategoryDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Nouvelle catégorie"
        initialValue={CATEGORIE_VIDE}
        onSubmit={handleCreate}
        isPending={isPending}
      />

      <CategoryDialog
        open={renaming !== null}
        onOpenChange={(open) => !open && setRenaming(null)}
        title={`Renommer « ${renaming?.titre ?? ""} »`}
        initialValue={
          renaming
            ? {
                titre: renaming.titre,
                description: renaming.description,
                domaine: renaming.domaine,
                icone: renaming.icone,
              }
            : CATEGORIE_VIDE
        }
        onSubmit={handleRename}
        isPending={isPending}
      />

      <MergeDialog
        open={mergingId !== null}
        onOpenChange={(open) => !open && setMergingId(null)}
        title={`Fusionner « ${mergingCategorie?.titre ?? ""} »`}
        description="La catégorie sera supprimée après la fusion ; son nombre d'articles sera reporté sur la catégorie choisie ci-dessous."
        options={mergeOptions}
        onConfirm={handleMergeConfirm}
        isPending={isPending}
      />
    </div>
  );
}
