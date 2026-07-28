import { Archive, FileDown, LayoutGrid, List as ListIcon, Trash2 } from "lucide-react";

import { AppButton } from "@/shared/components/app-button";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";

import type { PrayerTopicViewMode } from "../types/prayer-topic.types";

export interface PrayerTopicToolbarProps {
  view: PrayerTopicViewMode;
  onViewChange: (view: PrayerTopicViewMode) => void;
  onExport: () => void;
  selectedCount: number;
  onBulkArchive?: () => void;
  onBulkDelete?: () => void;
  expiredCount: number;
  onArchiveExpired?: () => void;
  isArchivingExpired?: boolean;
}

/** Barre d'outils des Sujets de prière : bascule Liste/Cartes, export, actions groupées et archivage des sujets expirés. */
export function PrayerTopicToolbar({
  view,
  onViewChange,
  onExport,
  selectedCount,
  onBulkArchive,
  onBulkDelete,
  expiredCount,
  onArchiveExpired,
  isArchivingExpired,
}: PrayerTopicToolbarProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={view} onValueChange={(value) => onViewChange(value as PrayerTopicViewMode)}>
          <TabsList>
            <TabsTrigger value="cards" aria-label="Vue cartes">
              <LayoutGrid className="size-4 sm:hidden" />
              <span className="hidden sm:inline">Cartes</span>
            </TabsTrigger>
            <TabsTrigger value="list" aria-label="Vue liste">
              <ListIcon className="size-4 sm:hidden" />
              <span className="hidden sm:inline">Liste</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap gap-2">
          {onArchiveExpired && expiredCount > 0 && (
            <AppButton variant="outline" size="sm" onClick={onArchiveExpired} isLoading={isArchivingExpired}>
              <Archive className="size-4" />
              Archiver les {expiredCount} sujet{expiredCount > 1 ? "s" : ""} expiré{expiredCount > 1 ? "s" : ""}
            </AppButton>
          )}
          <AppButton variant="outline" size="sm" onClick={onExport} aria-label="Exporter la vue courante en CSV">
            <FileDown className="size-4" />
            Exporter
          </AppButton>
        </div>
      </div>

      {selectedCount > 0 && (onBulkArchive || onBulkDelete) && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm">
          <span className="font-medium text-foreground">
            {selectedCount} sujet{selectedCount > 1 ? "s" : ""} sélectionné{selectedCount > 1 ? "s" : ""}
          </span>
          <div className="ml-auto flex gap-2">
            {onBulkArchive && (
              <AppButton variant="outline" size="sm" onClick={onBulkArchive}>
                <Archive className="size-4" />
                Archiver
              </AppButton>
            )}
            {onBulkDelete && (
              <AppButton variant="destructive" size="sm" onClick={onBulkDelete}>
                <Trash2 className="size-4" />
                Supprimer
              </AppButton>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
