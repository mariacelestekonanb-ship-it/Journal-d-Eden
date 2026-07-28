"use client";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { Archive, ArchiveRestore, MoreHorizontal, Pencil, Sparkles, Trash2 } from "lucide-react";
import * as React from "react";

import { formatDate } from "@/lib/format";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { EmptyState } from "@/shared/components/states/empty-state";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";

import { useArchivePrayerTopic, useDeletePrayerTopic, useRestorePrayerTopic } from "../hooks/use-prayer-topics";
import type { PrayerTopic } from "../types/prayer-topic.types";
import { PriorityBadge } from "./priority-badge";

interface PrayerTopicsTableProps {
  topics: PrayerTopic[];
  isAdmin: boolean;
  onEdit: (topic: PrayerTopic) => void;
  onCreateClick: () => void;
}

export function PrayerTopicsTable({ topics, isAdmin, onEdit, onCreateClick }: PrayerTopicsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [topicToDelete, setTopicToDelete] = React.useState<PrayerTopic | null>(null);

  const archiveMutation = useArchivePrayerTopic();
  const restoreMutation = useRestorePrayerTopic();
  const deleteMutation = useDeletePrayerTopic();

  const columns = React.useMemo<ColumnDef<PrayerTopic>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Sujet",
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-foreground">{row.original.title}</p>
            {row.original.description && (
              <p className="line-clamp-1 text-xs text-muted-foreground">{row.original.description}</p>
            )}
          </div>
        ),
      },
      {
        accessorKey: "priority",
        header: "Priorité",
        cell: ({ row }) => <PriorityBadge priority={row.original.priority} />,
      },
      {
        accessorKey: "start_date",
        header: "Début",
        cell: ({ row }) => formatDate(row.original.start_date),
      },
      {
        accessorKey: "end_date",
        header: "Fin",
        cell: ({ row }) => (row.original.end_date ? formatDate(row.original.end_date) : "—"),
      },
      {
        accessorKey: "status",
        header: "Statut",
        cell: ({ row }) => (
          <Badge variant={row.original.status === "actif" ? "success" : "outline"}>
            {row.original.status === "actif" ? "Actif" : "Archivé"}
          </Badge>
        ),
      },
      ...(isAdmin
        ? [
            {
              id: "actions",
              header: "",
              cell: ({ row }: { row: { original: PrayerTopic } }) => (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Actions">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => onEdit(row.original)}>
                      <Pencil className="size-4" />
                      Modifier
                    </DropdownMenuItem>
                    {row.original.status === "actif" ? (
                      <DropdownMenuItem onSelect={() => archiveMutation.mutate(row.original.id)}>
                        <Archive className="size-4" />
                        Archiver
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onSelect={() => restoreMutation.mutate(row.original.id)}>
                        <ArchiveRestore className="size-4" />
                        Réactiver
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onSelect={() => setTopicToDelete(row.original)}
                    >
                      <Trash2 className="size-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ),
            } satisfies ColumnDef<PrayerTopic>,
          ]
        : []),
    ],
    [isAdmin, onEdit, archiveMutation, restoreMutation],
  );

  const table = useReactTable({
    data: topics,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (topics.length === 0) {
    return (
      <EmptyState
        icon={Sparkles}
        title="Aucun sujet de prière"
        description={
          isAdmin
            ? "Créez le premier sujet de prière pour orienter les temps de prière de la communauté."
            : "Aucun sujet de prière n'a encore été publié."
        }
        action={
          isAdmin ? (
            <Button size="sm" onClick={onCreateClick}>
              Créer un sujet
            </Button>
          ) : undefined
        }
      />
    );
  }

  return (
    <>
      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        open={!!topicToDelete}
        onOpenChange={(open) => !open && setTopicToDelete(null)}
        title="Supprimer ce sujet de prière ?"
        description={`« ${topicToDelete?.title} » sera définitivement supprimé. Cette action est irréversible.`}
        isLoading={deleteMutation.isPending}
        onConfirm={async () => {
          if (!topicToDelete) return;
          await deleteMutation.mutateAsync(topicToDelete.id);
          setTopicToDelete(null);
        }}
      />
    </>
  );
}
