"use client";

import { Archive, ArchiveRestore, CalendarDays, Copy, Pencil, Trash2, User } from "lucide-react";

import { AppButton } from "@/shared/components/app-button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/sheet";
import { formatDate } from "@/shared/utils/format";

import type { PrayerTopic } from "../types/prayer-topic.types";
import { buildTopicLifecycleTimeline } from "../utils/build-topic-timeline";
import type { PrayerTopicPermissions } from "../utils/prayer-topic-permissions";
import { PrayerTopicCategoryBadge } from "./prayer-topic-category-badge";
import { PrayerTopicPriorityBadge } from "./prayer-topic-priority-badge";
import { PrayerTopicStatusBadge } from "./prayer-topic-status-badge";
import { PrayerTopicTimeline } from "./prayer-topic-timeline";

export interface PrayerTopicDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topic: PrayerTopic | null;
  permissions: PrayerTopicPermissions;
  onEditRequested: (topic: PrayerTopic) => void;
  onDuplicateRequested: (topic: PrayerTopic) => void;
  onArchiveRequested: (topic: PrayerTopic) => void;
  onRestoreRequested: (topic: PrayerTopic) => void;
  onDeleteRequested: (topic: PrayerTopic) => void;
}

/** Tiroir de consultation d'un sujet de prière — détail complet, historique et actions rapides. */
export function PrayerTopicDetailDrawer({
  open,
  onOpenChange,
  topic,
  permissions,
  onEditRequested,
  onDuplicateRequested,
  onArchiveRequested,
  onRestoreRequested,
  onDeleteRequested,
}: PrayerTopicDetailDrawerProps) {
  if (!topic) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-6 overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{topic.title}</SheetTitle>
          {topic.description && <SheetDescription>{topic.description}</SheetDescription>}
        </SheetHeader>

        <div className="flex flex-wrap gap-1.5">
          <PrayerTopicCategoryBadge category={topic.category} />
          <PrayerTopicPriorityBadge priority={topic.priority} />
          <PrayerTopicStatusBadge status={topic.status} />
        </div>

        <dl className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-foreground">
            <User className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span>{topic.authorName}</span>
          </div>
          <div className="flex items-center gap-2 text-foreground">
            <CalendarDays className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span>
              {formatDate(topic.startDate, "d MMMM yyyy")}
              {topic.endDate && ` → ${formatDate(topic.endDate, "d MMMM yyyy")}`}
            </span>
          </div>
        </dl>

        <div className="flex flex-wrap gap-2">
          {permissions.canEdit && (
            <AppButton variant="outline" size="sm" onClick={() => onEditRequested(topic)}>
              <Pencil className="size-4" />
              Modifier
            </AppButton>
          )}
          {permissions.canDuplicate && (
            <AppButton variant="outline" size="sm" onClick={() => onDuplicateRequested(topic)}>
              <Copy className="size-4" />
              Dupliquer
            </AppButton>
          )}
          {permissions.canArchive && topic.status !== "ARCHIVED" && (
            <AppButton variant="outline" size="sm" onClick={() => onArchiveRequested(topic)}>
              <Archive className="size-4" />
              Archiver
            </AppButton>
          )}
          {permissions.canRestore && topic.status === "ARCHIVED" && (
            <AppButton variant="outline" size="sm" onClick={() => onRestoreRequested(topic)}>
              <ArchiveRestore className="size-4" />
              Restaurer
            </AppButton>
          )}
          {permissions.canDelete && (
            <AppButton variant="destructive" size="sm" onClick={() => onDeleteRequested(topic)}>
              <Trash2 className="size-4" />
              Supprimer
            </AppButton>
          )}
        </div>

        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">Historique</p>
          <PrayerTopicTimeline entries={buildTopicLifecycleTimeline(topic)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
