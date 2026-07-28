"use client";

import { Plus } from "lucide-react";
import * as React from "react";

import { PageHeader } from "@/shared/components/page-header";
import { ErrorState } from "@/shared/components/states/error-state";
import { TableLoadingState } from "@/shared/components/states/loading-state";
import { Button } from "@/shared/components/ui/button";

import { usePrayerTopics } from "../hooks/use-prayer-topics";
import type { PrayerTopic } from "../types/prayer-topic.types";
import { PrayerTopicFormDialog } from "./prayer-topic-form-dialog";
import { PrayerTopicsTable } from "./prayer-topics-table";

export function PrayerTopicsView({ currentUserId, isAdmin }: { currentUserId: string; isAdmin: boolean }) {
  const { data: topics, isLoading, isError, refetch } = usePrayerTopics();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingTopic, setEditingTopic] = React.useState<PrayerTopic | undefined>(undefined);

  function handleCreateClick() {
    setEditingTopic(undefined);
    setDialogOpen(true);
  }

  function handleEdit(topic: PrayerTopic) {
    setEditingTopic(topic);
    setDialogOpen(true);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sujets de prière"
        description="Suivez les sujets portés par la communauté, avec priorité et archivage automatique."
        actions={
          isAdmin ? (
            <Button onClick={handleCreateClick}>
              <Plus className="size-4" />
              Nouveau sujet
            </Button>
          ) : undefined
        }
      />

      {isLoading && <TableLoadingState />}
      {isError && <ErrorState onRetry={() => refetch()} />}
      {!isLoading && !isError && (
        <PrayerTopicsTable
          topics={topics ?? []}
          isAdmin={isAdmin}
          onEdit={handleEdit}
          onCreateClick={handleCreateClick}
        />
      )}

      {isAdmin && (
        <PrayerTopicFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          currentUserId={currentUserId}
          topic={editingTopic}
        />
      )}
    </div>
  );
}
