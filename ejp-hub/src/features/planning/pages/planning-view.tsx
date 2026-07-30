"use client";

import dynamic from "next/dynamic";
import * as React from "react";

import type { Role } from "@/shared/constants/roles";
import { AppButton } from "@/shared/components/app-button";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { Skeleton } from "@/shared/ui/skeleton";

import { PlanningDialog, type PlanningDialogMode } from "../components/planning-dialog";
import { PlanningEmptyState } from "../components/planning-empty-state";
import { PlanningFilters } from "../components/planning-filters";
import { PlanningHeader } from "../components/planning-header";
import { PlanningImportDialog } from "../components/planning-import-dialog";
import { PlanningTable } from "../components/planning-table";
import { PlanningToolbar } from "../components/planning-toolbar";
import { ProgramsTab } from "../components/programs-tab";
import { applyPlanningFilters, usePlanningFilters } from "../hooks/use-planning-filters";
import { useCancelSlot, useDeleteSlot, useDuplicateSlot, useRescheduleSlot } from "../hooks/use-planning-mutations";
import { usePlanningSlots } from "../hooks/use-planning-slots";
import { usePlanningView } from "../hooks/use-planning-view";
import { PlanningExportService } from "../services/planning-export.service";
import type { PrayerSlot } from "../types/planning.types";
import { getPlanningPermissions } from "../utils/planning-permissions";

const PlanningCalendar = dynamic(
  () => import("../components/planning-calendar").then((mod) => mod.PlanningCalendar),
  { ssr: false, loading: () => <Skeleton className="h-[600px] w-full" /> },
);

interface DialogState {
  mode: PlanningDialogMode;
  slot?: PrayerSlot;
  defaultDate?: string;
}

interface ConfirmState {
  type: "delete" | "cancel";
  slot: PrayerSlot;
}

export interface PlanningViewProps {
  role: Role;
}

/**
 * Composition de la page Planning. Chaque section (calendrier, liste,
 * filtres, formulaire) reste un composant autonome — cette page orchestre
 * seulement l'état partagé (vue active, filtres, dialogue ouvert).
 */
export function PlanningView({ role }: PlanningViewProps) {
  const permissions = React.useMemo(() => getPlanningPermissions(role), [role]);

  const { data: slots, isLoading, isError, refetch } = usePlanningSlots();
  const [view, setView] = usePlanningView();
  const { filters, updateFilter, resetFilters, hasActiveFilters } = usePlanningFilters();

  const [dialogState, setDialogState] = React.useState<DialogState | null>(null);
  const [confirmState, setConfirmState] = React.useState<ConfirmState | null>(null);
  const [isImportOpen, setIsImportOpen] = React.useState(false);

  const rescheduleMutation = useRescheduleSlot();
  const cancelMutation = useCancelSlot();
  const deleteMutation = useDeleteSlot();
  const duplicateMutation = useDuplicateSlot();

  const filteredSlots = React.useMemo(() => applyPlanningFilters(slots ?? [], filters), [slots, filters]);

  const handleView = React.useCallback((slot: PrayerSlot) => {
    setDialogState({ mode: "view", slot });
  }, []);

  const handleEdit = React.useCallback((slot: PrayerSlot) => {
    setDialogState({ mode: "edit", slot });
  }, []);

  const handleDuplicate = React.useCallback(
    (slot: PrayerSlot) => {
      duplicateMutation.mutate(slot.id);
      setDialogState(null);
    },
    [duplicateMutation],
  );

  const handleCancel = React.useCallback((slot: PrayerSlot) => {
    setConfirmState({ type: "cancel", slot });
    setDialogState(null);
  }, []);

  const handleDelete = React.useCallback((slot: PrayerSlot) => {
    setConfirmState({ type: "delete", slot });
    setDialogState(null);
  }, []);

  const tableCallbacks = React.useMemo(
    () => ({
      onView: handleView,
      onEdit: handleEdit,
      onDuplicate: handleDuplicate,
      onCancel: handleCancel,
      onDelete: handleDelete,
    }),
    [handleView, handleEdit, handleDuplicate, handleCancel, handleDelete],
  );

  return (
    <div className="space-y-6">
      <PlanningHeader permissions={permissions} onCreateClick={() => setDialogState({ mode: "create" })} />

      <PlanningToolbar
        view={view}
        onViewChange={setView}
        onExport={() => PlanningExportService.downloadCsv(filteredSlots, `planning-${view}`)}
        onImport={permissions.canCreate ? () => setIsImportOpen(true) : undefined}
      />

      {view === "programs" ? (
        <ProgramsTab
          canManage={permissions.canCreate}
          onViewProgramPlanning={(programId) => {
            updateFilter("programId", programId);
            setView("list");
          }}
        />
      ) : (
        <>
          <PlanningFilters
            filters={filters}
            onChange={updateFilter}
            onReset={resetFilters}
            hasActiveFilters={hasActiveFilters}
          />

          {isLoading && (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          )}
          {isError && (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
              <p className="text-sm text-muted-foreground">Impossible de charger le planning pour le moment.</p>
              <AppButton variant="outline" size="sm" onClick={() => refetch()}>
                Réessayer
              </AppButton>
            </div>
          )}

          {!isLoading && !isError && filteredSlots.length === 0 && (
            <PlanningEmptyState
              description={
                hasActiveFilters
                  ? "Aucun créneau ne correspond à ces filtres. Essayez de les réinitialiser."
                  : "Aucun créneau n'a encore été planifié."
              }
            />
          )}

          {!isLoading && !isError && filteredSlots.length > 0 && (
            <>
              {view === "list" ? (
                <PlanningTable slots={filteredSlots} permissions={permissions} callbacks={tableCallbacks} />
              ) : (
                <PlanningCalendar
                  slots={filteredSlots}
                  view={view}
                  permissions={permissions}
                  onSlotClick={handleView}
                  onDateClick={(dateStr) => setDialogState({ mode: "create", defaultDate: dateStr })}
                  onReschedule={(id, schedule) => rescheduleMutation.mutateAsync({ id, schedule })}
                />
              )}
            </>
          )}
        </>
      )}

      {dialogState && (
        <PlanningDialog
          open={!!dialogState}
          onOpenChange={(open) => !open && setDialogState(null)}
          mode={dialogState.mode}
          slot={dialogState.slot}
          defaultDate={dialogState.defaultDate}
          permissions={permissions}
          onEditRequested={handleEdit}
          onDuplicateRequested={handleDuplicate}
          onCancelRequested={handleCancel}
          onDeleteRequested={handleDelete}
        />
      )}

      <PlanningImportDialog open={isImportOpen} onOpenChange={setIsImportOpen} />

      <ConfirmDialog
        open={!!confirmState}
        onOpenChange={(open) => !open && setConfirmState(null)}
        title={confirmState?.type === "delete" ? "Supprimer ce créneau ?" : "Annuler ce créneau ?"}
        description={
          confirmState?.type === "delete"
            ? `« ${confirmState.slot.title} » sera définitivement supprimé. Cette action est irréversible.`
            : `« ${confirmState?.slot.title} » sera marqué comme annulé. Vous pourrez le consulter mais plus le modifier normalement.`
        }
        confirmLabel={confirmState?.type === "delete" ? "Supprimer" : "Annuler le créneau"}
        isLoading={deleteMutation.isPending || cancelMutation.isPending}
        onConfirm={async () => {
          if (!confirmState) return;
          if (confirmState.type === "delete") {
            await deleteMutation.mutateAsync(confirmState.slot.id);
          } else {
            await cancelMutation.mutateAsync(confirmState.slot.id);
          }
          setConfirmState(null);
        }}
      />
    </div>
  );
}
