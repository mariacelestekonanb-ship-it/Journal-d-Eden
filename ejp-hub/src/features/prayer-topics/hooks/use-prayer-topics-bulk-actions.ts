"use client";

import type { RowSelectionState } from "@tanstack/react-table";
import * as React from "react";

import { PrayerTopicArchiveService } from "../services/prayer-topic-archive.service";
import type { PrayerTopic } from "../types/prayer-topic.types";
import type { PrayerTopicPermissions } from "../utils/prayer-topic-permissions";
import { useArchiveExpiredTopics, useArchiveTopic } from "./use-prayer-topic-mutations";

/**
 * État et actions groupées de la vue Liste : sélection multiple (archivage
 * groupé) et détection + archivage des sujets expirés. Isolé de la page
 * pour garder `PrayerTopicsView` centrée sur l'orchestration des sections.
 */
export function usePrayerTopicsBulkActions(topics: PrayerTopic[] | undefined, permissions: PrayerTopicPermissions) {
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const archiveMutation = useArchiveTopic();
  const archiveExpiredMutation = useArchiveExpiredTopics();

  const selectedIds = React.useMemo(() => Object.keys(rowSelection).filter((id) => rowSelection[id]), [rowSelection]);
  const expiredTopics = React.useMemo(() => PrayerTopicArchiveService.findExpiredTopics(topics ?? []), [topics]);

  const bulkArchive =
    permissions.canArchive && selectedIds.length > 0
      ? () => {
          selectedIds.forEach((id) => archiveMutation.mutate(id));
          setRowSelection({});
        }
      : undefined;

  const archiveExpired = permissions.canArchive
    ? () => archiveExpiredMutation.mutate(expiredTopics.map((topic) => topic.id))
    : undefined;

  return {
    rowSelection,
    setRowSelection,
    selectedIds,
    expiredCount: expiredTopics.length,
    bulkArchive,
    archiveExpired,
    isArchivingExpired: archiveExpiredMutation.isPending,
  };
}
