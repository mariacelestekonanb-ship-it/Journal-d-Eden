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
import type { AdminStatus, RessourceAdmin } from "@/lib/admin/types";

export interface RessourcesListProps {
  items: RessourceAdmin[];
}

/** Liste des ressources — même structure que `FichesList`. */
export function RessourcesList({ items }: RessourcesListProps) {
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

  const columns: ContentTableColumn<RessourceAdmin>[] = [
    {
      header: "Titre",
      render: (item) => (
        <div>
          <Link
            href={`/admin/ressources/${item.id}`}
            className="font-medium hover:underline"
          >
            {item.titre}
          </Link>
          <p className="text-muted-foreground text-xs">{item.organisme}</p>
        </div>
      ),
    },
    {
      header: "Type",
      render: (item) => <Badge variant="outline">{item.type}</Badge>,
    },
    {
      header: "Domaine",
      render: (item) => labelDomaine(item.domaine),
      className: "whitespace-nowrap",
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
          entity="ressource"
          id={item.id}
          titre={item.titre}
          status={item.status}
          editHref={`/admin/ressources/${item.id}`}
          previewHref={item.status === "publie" ? "/ressources" : undefined}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Heading as="h1" size="lg">
          Ressources
        </Heading>
        <Paragraph tone="muted" className="mt-1">
          Textes officiels, rapports et guides recommandés par la rédaction.
        </Paragraph>
      </div>

      <PageToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Rechercher une ressource…"
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        createHref="/admin/ressources/nouveau"
        createLabel="Nouvelle ressource"
      />

      <ContentTable
        items={filtered}
        columns={columns}
        getRowKey={(item) => item.id}
        emptyTitle="Aucune ressource"
        emptyDescription="Aucune ressource ne correspond à ces filtres."
      />
    </div>
  );
}
