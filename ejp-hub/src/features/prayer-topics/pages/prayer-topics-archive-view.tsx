"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import type { Role } from "@/shared/constants/roles";
import { AppButton } from "@/shared/components/app-button";
import { AppPageHeader } from "@/shared/components/app-page-header";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";

import { PrayerTopicDetailDrawer } from "../components/prayer-topic-detail-drawer";
import { PrayerTopicDialog, type PrayerTopicDialogMode } from "../components/prayer-topic-dialog";
import { PrayerTopicEmptyState } from "../components/prayer-topic-empty-state";
import { PrayerTopicGrid } from "../components/prayer-topic-grid";
import { useDeleteTopic, useDuplicateTopic, useRestoreTopic } from "../hooks/use-prayer-topic-mutations";
import { usePrayerTopics } from "../hooks/use-prayer-topics";
import type { PrayerTopic } from "../types/prayer-topic.types";
import { getPrayerTopicPermissions } from "../utils/prayer-topic-permissions";

interface DialogState {
  mode: PrayerTopicDialogMode;
  topic?: PrayerTopic;
}

export interface PrayerTopicsArchiveViewProps {
  role: Role;
}

/** Vue dédiée aux sujets archivés — consultation, restauration, suppression définitive. */
export function PrayerTopicsArchiveView({ role }: PrayerTopicsArchiveViewProps) {
  const permissions = React.useMemo(() => getPrayerTopicPermissions(role), [role]);

  const { data: topics, isLoading, isError, refetch } = usePrayerTopics();
  const archivedTopics = React.useMemo(() => (topics ?? []).filter((topic) => topic.status === "ARCHIVED"), [topics]);

  const [dialogState, setDialogState] = React.useState<DialogState | null>(null);
  const [detailTopic, setDetailTopic] = React.useState<PrayerTopic | null>(null);
  const [confirmTopic, setConfirmTopic] = React.useState<PrayerTopic | null>(null);

  const restoreMutation = useRestoreTopic();
  const deleteMutation = useDeleteTopic();
  const duplicateMutation = useDuplicateTopic();

  function handleEdit(topic: PrayerTopic) {
    setDetailTopic(null);
    setDialogState({ mode: "edit", topic });
  }

  function handleDuplicate(topic: PrayerTopic) {
    duplicateMutation.mutate(topic.id);
    setDetailTopic(null);
  }

  function handleRestore(topic: PrayerTopic) {
    restoreMutation.mutate(topic.id);
    setDetailTopic(null);
  }

  function handleDelete(topic: PrayerTopic) {
    setConfirmTopic(topic);
    setDetailTopic(null);
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="w-fit">
        <Link href="/sujets-de-priere">
          <ArrowLeft className="size-4" />
          Retour aux sujets
        </Link>
      </Button>

      <AppPageHeader
        title="Sujets archivés"
        description="Historique des sujets clos ou expirés — restauration possible à tout moment."
      />

      {isLoading && <Skeleton className="h-64 w-full" />}
      {isError && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <p className="text-sm text-muted-foreground">Impossible de charger les archives pour le moment.</p>
          <AppButton variant="outline" size="sm" onClick={() => refetch()}>
            Réessayer
          </AppButton>
        </div>
      )}

      {!isLoading && !isError && archivedTopics.length === 0 && (
        <PrayerTopicEmptyState
          title="Aucune archive"
          description="Les sujets archivés (manuellement ou automatiquement) apparaîtront ici."
        />
      )}

      {!isLoading && !isError && archivedTopics.length > 0 && (
        <PrayerTopicGrid
          topics={archivedTopics}
          permissions={permissions}
          callbacks={{
            onView: setDetailTopic,
            onEdit: handleEdit,
            onDuplicate: handleDuplicate,
            onArchive: () => {},
            onRestore: handleRestore,
            onDelete: handleDelete,
          }}
        />
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
        onArchiveRequested={() => {}}
        onRestoreRequested={handleRestore}
        onDeleteRequested={handleDelete}
      />

      <ConfirmDialog
        open={!!confirmTopic}
        onOpenChange={(open) => !open && setConfirmTopic(null)}
        title="Supprimer définitivement ce sujet ?"
        description={`« ${confirmTopic?.title} » sera définitivement supprimé. Cette action est irréversible.`}
        confirmLabel="Supprimer"
        isLoading={deleteMutation.isPending}
        onConfirm={async () => {
          if (!confirmTopic) return;
          await deleteMutation.mutateAsync(confirmTopic.id);
          setConfirmTopic(null);
        }}
      />
    </div>
  );
}
