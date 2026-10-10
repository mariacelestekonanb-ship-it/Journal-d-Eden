"use client";

import * as React from "react";
import Link from "next/link";

import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { Badge } from "@/components/ui/badge";
import { PageToolbar } from "@/components/admin/content/page-toolbar";
import {
  ContentTable,
  type ContentTableColumn,
} from "@/components/admin/content/content-table";
import { StatusBadge } from "@/components/admin/content/status-badge";
import { RowActionsMenu } from "@/components/admin/content/row-actions-menu";
import { formatDate, labelDomaine } from "@/lib/format";
import type { AdminStatus, AnalyseAdmin } from "@/lib/admin/types";

export interface VeilleListProps {
  items: AnalyseAdmin[];
}

/** Liste des analyses de veille — même structure que `FichesList` (voir `app/admin/fiches/fiches-list.tsx`). */
export function VeilleList({ items }: VeilleListProps) {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<AdminStatus | "tous">(
    "tous",
  );

  const filtered = items.filter((item) => {
    const matchStatus = statusFilter === "tous" || item.status === statusFilter;
    const matchSearch = item.titre
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    return matchStatus && matchSearch;
  });

  const columns: ContentTableColumn<AnalyseAdmin>[] = [
    {
      header: "Titre",
      render: (item) => (
        <div>
          <Link
            href={`/admin/veille/${item.id}`}
            className="font-medium hover:underline"
          >
            {item.titre}
          </Link>
          <p className="text-muted-foreground text-xs">
            {item.type} · {item.source}
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
          entity="analyse"
          id={item.id}
          titre={item.titre}
          status={item.status}
          editHref={`/admin/veille/${item.id}`}
          previewHref={
            item.status === "publie"
              ? `/veille-juridique/${item.slug}`
              : undefined
          }
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Heading as="h1" size="lg">
          Veille juridique
        </Heading>
        <Paragraph tone="muted" className="mt-1">
          Analyses de décisions, textes et actualités juridiques.
        </Paragraph>
      </div>

      <PageToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Rechercher une analyse…"
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        createHref="/admin/veille/nouveau"
        createLabel="Nouvelle analyse"
      />

      <ContentTable
        items={filtered}
        columns={columns}
        getRowKey={(item) => item.id}
        emptyTitle="Aucune analyse"
        emptyDescription="Aucune analyse ne correspond à ces filtres."
      />
    </div>
  );
}
