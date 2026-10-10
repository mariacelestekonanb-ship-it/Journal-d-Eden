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
import type { AdminStatus, FicheAdmin } from "@/lib/admin/types";

export interface FichesListProps {
  items: FicheAdmin[];
}

/** Liste des fiches — page de référence dont les autres modules de contenu reprennent la structure (barre d'outils + tableau + actions rapides). */
export function FichesList({ items }: FichesListProps) {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<AdminStatus | "tous">(
    "tous",
  );

  const filtered = items.filter((item) => {
    const matchStatus = statusFilter === "tous" || item.status === statusFilter;
    const matchSearch = item.question
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    return matchStatus && matchSearch;
  });

  const columns: ContentTableColumn<FicheAdmin>[] = [
    {
      header: "Question",
      render: (item) => (
        <div>
          <Link
            href={`/admin/fiches/${item.id}`}
            className="font-medium hover:underline"
          >
            {item.question}
          </Link>
          <p className="text-muted-foreground text-xs">{item.categorie}</p>
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
      header: "Niveau",
      render: (item) => item.niveau,
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
          entity="fiche"
          id={item.id}
          titre={item.question}
          status={item.status}
          editHref={`/admin/fiches/${item.id}`}
          previewHref={
            item.status === "publie" ? `/comprendre/${item.slug}` : undefined
          }
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Heading as="h1" size="lg">
          Fiches
        </Heading>
        <Paragraph tone="muted" className="mt-1">
          Questions-réponses pédagogiques publiées sur « Comprendre ».
        </Paragraph>
      </div>

      <PageToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Rechercher une fiche…"
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        createHref="/admin/fiches/nouveau"
        createLabel="Nouvelle fiche"
      />

      <ContentTable
        items={filtered}
        columns={columns}
        getRowKey={(item) => item.id}
        emptyTitle="Aucune fiche"
        emptyDescription="Aucune fiche ne correspond à ces filtres."
      />
    </div>
  );
}
