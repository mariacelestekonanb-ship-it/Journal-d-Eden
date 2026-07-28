"use client";

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, Columns3 } from "lucide-react";
import * as React from "react";

import { AppButton } from "@/shared/components/app-button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";

import type { PrayerSlot } from "../types/planning.types";
import type { PlanningPermissions } from "../utils/planning-permissions";
import { PlanningEmptyState } from "./planning-empty-state";
import { getPlanningTableColumns, type PlanningTableCallbacks } from "./planning-table-columns";

const HIDEABLE_COLUMN_LABELS: Record<string, string> = {
  location: "Lieu",
  secondaryLeader: "Conducteur secondaire",
  status: "Statut",
};

export interface PlanningTableProps {
  slots: PrayerSlot[];
  permissions: PlanningPermissions;
  callbacks: PlanningTableCallbacks;
}

/** Liste des créneaux — TanStack Table : tri, pagination, colonnes masquables. */
export function PlanningTable({ slots, permissions, callbacks }: PlanningTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "date", desc: false }]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

  const columns = React.useMemo(() => getPlanningTableColumns(permissions, callbacks), [permissions, callbacks]);

  const table = useReactTable({
    data: slots,
    columns,
    state: { sorting, columnVisibility },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  if (slots.length === 0) {
    return <PlanningEmptyState />;
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
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

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap">
                    {header.isPlaceholder ? null : (
                      <button
                        type="button"
                        className="flex items-center gap-1 disabled:cursor-default"
                        disabled={!header.column.getCanSort()}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{ asc: " ↑", desc: " ↓" }[header.column.getIsSorted() as string] ?? null}
                      </button>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          Page {table.getState().pagination.pageIndex + 1} sur {Math.max(table.getPageCount(), 1)} ·{" "}
          {slots.length} créneau{slots.length > 1 ? "x" : ""}
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
