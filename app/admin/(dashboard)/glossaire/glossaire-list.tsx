"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Merge } from "lucide-react";

import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { PageToolbar } from "@/components/admin/content/page-toolbar";
import {
  ContentTable,
  type ContentTableColumn,
} from "@/components/admin/content/content-table";
import { StatusBadge } from "@/components/admin/content/status-badge";
import { RowActionsMenu } from "@/components/admin/content/row-actions-menu";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MergeDialog } from "@/components/admin/content/merge-dialog";
import { mergeTermes } from "@/lib/admin/glossaire-actions";
import { formatDate } from "@/lib/format";
import type { AdminStatus, GlossaireTermeAdmin } from "@/lib/admin/types";

export interface GlossaireListProps {
  items: GlossaireTermeAdmin[];
}

/** Liste des termes du glossaire — même structure que `FichesList`, avec en plus la fusion de deux termes. */
export function GlossaireList({ items }: GlossaireListProps) {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<AdminStatus | "tous">(
    "tous",
  );
  const [mergingId, setMergingId] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  const filtered = items.filter((item) => {
    const matchStatus = statusFilter === "tous" || item.status === statusFilter;
    const matchSearch = item.terme
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    return matchStatus && matchSearch;
  });

  function handleMergeConfirm(targetId: string) {
    if (!mergingId) return;
    startTransition(async () => {
      await mergeTermes(mergingId, targetId);
      setMergingId(null);
      router.refresh();
    });
  }

  const columns: ContentTableColumn<GlossaireTermeAdmin>[] = [
    {
      header: "Terme",
      render: (item) => (
        <div>
          <Link
            href={`/admin/glossaire/${item.id}`}
            className="font-medium hover:underline"
          >
            {item.terme}
          </Link>
          <p className="text-muted-foreground line-clamp-1 text-xs">
            {item.definition}
          </p>
        </div>
      ),
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
          entity="glossaire"
          id={item.id}
          titre={item.terme}
          status={item.status}
          editHref={`/admin/glossaire/${item.id}`}
          previewHref={
            item.status === "publie" ? `/glossaire#${item.id}` : undefined
          }
          extraItems={
            <DropdownMenuItem onSelect={() => setMergingId(item.id)}>
              <Merge aria-hidden />
              Fusionner
            </DropdownMenuItem>
          }
        />
      ),
    },
  ];

  const mergingTerme = items.find((item) => item.id === mergingId);
  const mergeOptions = items
    .filter((item) => item.id !== mergingId)
    .map((item) => ({ id: item.id, label: item.terme }));

  return (
    <div className="space-y-6">
      <div>
        <Heading as="h1" size="lg">
          Glossaire
        </Heading>
        <Paragraph tone="muted" className="mt-1">
          Définitions des termes juridiques et techniques du droit spatial et
          numérique.
        </Paragraph>
      </div>

      <PageToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Rechercher un terme…"
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        createHref="/admin/glossaire/nouveau"
        createLabel="Nouveau terme"
      />

      <ContentTable
        items={filtered}
        columns={columns}
        getRowKey={(item) => item.id}
        emptyTitle="Aucun terme"
        emptyDescription="Aucun terme ne correspond à ces filtres."
      />

      <MergeDialog
        open={mergingId !== null}
        onOpenChange={(open) => !open && setMergingId(null)}
        title={`Fusionner « ${mergingTerme?.terme ?? ""} »`}
        description="Le terme sera supprimé après la fusion ; ses renvois et contenus associés seront reportés sur le terme choisi ci-dessous."
        options={mergeOptions}
        onConfirm={handleMergeConfirm}
        isPending={isPending}
      />
    </div>
  );
}
