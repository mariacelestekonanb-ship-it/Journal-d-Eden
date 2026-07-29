"use client";

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, Columns3 } from "lucide-react";
import * as React from "react";

import { AppButton } from "@/shared/components/app-button";
import { AppCard } from "@/shared/components/app-card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";

import type { Report, ReportCallbacks } from "../types/report.types";
import type { ReportPermissions } from "../utils/report-permissions";
import { ReportEmptyState } from "./report-empty-state";
import { getReportTableColumns } from "./report-table-columns";

const HIDEABLE_COLUMN_LABELS: Record<string, string> = {
  leader: "Conducteur",
  participants: "Participants",
  author: "Auteur",
  updatedAt: "Dernière modification",
};

export interface ReportTableProps {
  reports: Report[];
  permissions: ReportPermissions;
  currentUserId: string;
  callbacks: ReportCallbacks;
  rowSelection: RowSelectionState;
  onRowSelectionChange: (selection: RowSelectionState) => void;
}

/** Liste des comptes rendus — TanStack Table : tri multi-colonnes, pagination, colonnes masquables, sélection multiple. */
export function ReportTable({
  reports,
  permissions,
  currentUserId,
  callbacks,
  rowSelection,
  onRowSelectionChange,
}: ReportTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "date", desc: true }]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

  const columns = React.useMemo(
    () => getReportTableColumns(permissions, currentUserId, callbacks),
    [permissions, currentUserId, callbacks],
  );

  const table = useReactTable({
    data: reports,
    columns,
    state: { sorting, columnVisibility, rowSelection },
    getRowId: (row) => row.id,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: (updater) => {
      const next = typeof updater === "function" ? updater(rowSelection) : updater;
      onRowSelectionChange(next);
    },
    enableRowSelection: true,
    enableMultiSort: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  if (reports.length === 0) {
    return <ReportEmptyState />;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">Maj+clic sur une colonne pour trier sur plusieurs critères.</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <AppButton variant="outline" size="sm">
              <Columns3 className="size-4" />
              Colonnes
            </AppButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.id in HIDEABLE_COLUMN_LABELS)
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {HIDEABLE_COLUMN_LABELS[column.id]}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AppCard className="overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap">
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <button
                        type="button"
                        className="flex items-center gap-1"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{ asc: " ↑", desc: " ↓" }[header.column.getIsSorted() as string] ?? null}
                        {header.column.getSortIndex() > -1 && table.getState().sorting.length > 1 && (
                          <sup>{header.column.getSortIndex() + 1}</sup>
                        )}
                      </button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AppCard>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          Page {table.getState().pagination.pageIndex + 1} sur {Math.max(table.getPageCount(), 1)} · {reports.length}{" "}
          compte{reports.length > 1 ? "s" : ""} rendu{reports.length > 1 ? "s" : ""}
        </p>
        <div className="flex gap-2">
          <AppButton
            variant="outline"
            size="icon"
            aria-label="Page précédente"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="size-4" />
          </AppButton>
          <AppButton
            variant="outline"
            size="icon"
            aria-label="Page suivante"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="size-4" />
          </AppButton>
        </div>
      </div>
    </div>
  );
}
