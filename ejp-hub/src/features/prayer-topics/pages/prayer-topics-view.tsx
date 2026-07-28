"use client";

import * as React from "react";

import type { Role } from "@/shared/constants/roles";
import { AppButton } from "@/shared/components/app-button";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { Skeleton } from "@/shared/ui/skeleton";

import { PrayerTopicDashboardSection } from "../components/prayer-topic-dashboard-section";
import { PrayerTopicDetailDrawer } from "../components/prayer-topic-detail-drawer";
import { PrayerTopicDialog, type PrayerTopicDialogMode } from "../components/prayer-topic-dialog";
import { PrayerTopicFilters } from "../components/prayer-topic-filters";
import { PrayerTopicGrid } from "../components/prayer-topic-grid";
import { PrayerTopicHeader } from "../components/prayer-topic-header";
import { PrayerTopicTable } from "../components/prayer-topic-table";
import { PrayerTopicToolbar } from "../components/prayer-topic-toolbar";
import { useArchiveTopic, useDeleteTopic, useDuplicateTopic, useRestoreTopic } from "../hooks/use-prayer-topic-mutations";
import { applyPrayerTopicFilters, usePrayerTopicsFilters } from "../hooks/use-prayer-topics-filters";
import { usePrayerTopicsBulkActions } from "../hooks/use-prayer-topics-bulk-actions";
import { usePrayerTopicStats } from "../hooks/use-prayer-topic-stats";
import { usePrayerTopics } from "../hooks/use-prayer-topics";
import { usePrayerTopicsView } from "../hooks/use-prayer-topics-view";
import type { PrayerTopic } from "../types/prayer-topic.types";
import { buildRecentTopicsTimeline } from "../utils/build-topic-timeline";
import { downloadPrayerTopicsCsv } from "../utils/export-prayer-topics-csv";
import { getPrayerTopicPermissions } from "../utils/prayer-topic-permissions";

interface DialogState {
  mode: PrayerTopicDialogMode;
  topic?: PrayerTopic;
}

interface ConfirmState {
  type: "delete" | "bulk-delete";
  topic?: PrayerTopic;
  ids?: string[];
}

export interface PrayerTopicsViewProps {
  role: Role;
}

/**
 * Composition de la page Sujets de prière. Chaque section (tableau de bord,
 * filtres, liste/cartes) reste un composant autonome — cette page orchestre
 * seulement l'état partagé (vue active, filtres, sélection, dialogues).
 */
export function PrayerTopicsView({ role }: PrayerTopicsViewProps) {
  const permissions = React.useMemo(() => getPrayerTopicPermissions(role), [role]);

  const { data: topics, isLoading, isError, refetch } = usePrayerTopics();
  const { stats, isLoading: isStatsLoading } = usePrayerTopicStats();
  const [view, setView] = usePrayerTopicsView();
  const { filters, updateFilter, resetFilters, hasActiveFilters } = usePrayerTopicsFilters();

  const [dialogState, setDialogState] = React.useState<DialogState | null>(null);
  const [detailTopic, setDetailTopic] = React.useState<PrayerTopic | null>(null);
  const [confirmState, setConfirmState] = React.useState<ConfirmState | null>(null);

  const { mutate: archiveTopic } = useArchiveTopic();
  const { mutate: restoreTopic } = useRestoreTopic();
  const deleteMutation = useDeleteTopic();
  const { mutate: duplicateTopic } = useDuplicateTopic();
  const bulkActions = usePrayerTopicsBulkActions(topics, permissions);

  const filteredTopics = React.useMemo(() => applyPrayerTopicFilters(topics ?? [], filters), [topics, filters]);
  const recentEntries = React.useMemo(() => buildRecentTopicsTimeline(topics ?? []), [topics]);

  const handleEdit = React.useCallback((topic: PrayerTopic) => {
    setDetailTopic(null);
    setDialogState({ mode: "edit", topic });
  }, []);

  const handleDuplicate = React.useCallback(
    (topic: PrayerTopic) => {
      duplicateTopic(topic.id);
      setDetailTopic(null);
    },
    [duplicateTopic],
  );

  const handleArchive = React.useCallback(
    (topic: PrayerTopic) => {
      archiveTopic(topic.id);
      setDetailTopic(null);
    },
    [archiveTopic],
  );

  const handleRestore = React.useCallback(
    (topic: PrayerTopic) => {
      restoreTopic(topic.id);
      setDetailTopic(null);
    },
    [restoreTopic],
  );

  const handleDelete = React.useCallback((topic: PrayerTopic) => {
    setConfirmState({ type: "delete", topic });
    setDetailTopic(null);
  }, []);

  const callbacks = React.useMemo(
    () => ({
      onView: setDetailTopic,
      onEdit: handleEdit,
      onDuplicate: handleDuplicate,
      onArchive: handleArchive,
      onRestore: handleRestore,
      onDelete: handleDelete,
    }),
    [handleEdit, handleDuplicate, handleArchive, handleRestore, handleDelete],
  );

  return (
    <div className="space-y-6">
      <PrayerTopicHeader permissions={permissions} onCreateClick={() => setDialogState({ mode: "create" })} />

      <PrayerTopicDashboardSection stats={stats} isStatsLoading={isStatsLoading} recentEntries={recentEntries} />

      <PrayerTopicToolbar
        view={view}
        onViewChange={setView}
        onExport={() => downloadPrayerTopicsCsv(filteredTopics, `sujets-de-priere-${view}`)}
        selectedCount={bulkActions.selectedIds.length}
        onBulkArchive={bulkActions.bulkArchive}
        onBulkDelete={
          permissions.canDelete && bulkActions.selectedIds.length > 0
            ? () => setConfirmState({ type: "bulk-delete", ids: bulkActions.selectedIds })
            : undefined
        }
        expiredCount={bulkActions.expiredCount}
        onArchiveExpired={bulkActions.archiveExpired}
        isArchivingExpired={bulkActions.isArchivingExpired}
      />

      <PrayerTopicFilters
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
          <p className="text-sm text-muted-foreground">Impossible de charger les sujets de prière pour le moment.</p>
          <AppButton variant="outline" size="sm" onClick={() => refetch()}>
            Réessayer
          </AppButton>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {view === "list" ? (
            <PrayerTopicTable
              topics={filteredTopics}
              permissions={permissions}
              callbacks={callbacks}
              rowSelection={bulkActions.rowSelection}
              onRowSelectionChange={bulkActions.setRowSelection}
            />
          ) : (
            <PrayerTopicGrid topics={filteredTopics} permissions={permissions} callbacks={callbacks} />
          )}
        </>
      )}

      {dialogState && (
        <PrayerTopicDialog
          open={!!dialogState}
          onOpenChange={(open) => !open && setDialogState(null)}
          mode={dialogState.mode}
          topic={dialogState.topic}
        />
      )}

      <PrayerTopicDetailDrawer
        open={!!detailTopic}
        onOpenChange={(open) => !open && setDetailTopic(null)}
        topic={detailTopic}
        permissions={permissions}
        onEditRequested={handleEdit}
        onDuplicateRequested={handleDuplicate}
        onArchiveRequested={handleArchive}
        onRestoreRequested={handleRestore}
        onDeleteRequested={handleDelete}
      />

      <ConfirmDialog
        open={!!confirmState}
        onOpenChange={(open) => !open && setConfirmState(null)}
        title={confirmState?.type === "bulk-delete" ? "Supprimer ces sujets ?" : "Supprimer ce sujet ?"}
        description={
          confirmState?.type === "bulk-delete"
            ? `${confirmState.ids?.length} sujets seront définitivement supprimés. Cette action est irréversible.`
            : `« ${confirmState?.topic?.title} » sera définitivement supprimé. Cette action est irréversible.`
        }
        confirmLabel="Supprimer"
        isLoading={deleteMutation.isPending}
        onConfirm={async () => {
          if (!confirmState) return;
          if (confirmState.type === "bulk-delete" && confirmState.ids) {
            await Promise.all(confirmState.ids.map((id) => deleteMutation.mutateAsync(id)));
            bulkActions.setRowSelection({});
          } else if (confirmState.topic) {
            await deleteMutation.mutateAsync(confirmState.topic.id);
          }
          setConfirmState(null);
        }}
      />
    </div>
  );
}
