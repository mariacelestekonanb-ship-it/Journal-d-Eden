import { Archive, ArchiveRestore, CalendarDays, Copy, Eye, MoreHorizontal, Pencil, Trash2, User } from "lucide-react";
import * as React from "react";

import { AppCard, AppCardContent } from "@/shared/components/app-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { formatDate } from "@/shared/utils/format";

import type { PrayerTopic, PrayerTopicCallbacks } from "../types/prayer-topic.types";
import type { PrayerTopicPermissions } from "../utils/prayer-topic-permissions";
import { PrayerTopicCategoryBadge } from "./prayer-topic-category-badge";
import { PrayerTopicPriorityBadge } from "./prayer-topic-priority-badge";
import { PrayerTopicStatusBadge } from "./prayer-topic-status-badge";

export interface PrayerTopicCardProps {
  topic: PrayerTopic;
  permissions: PrayerTopicPermissions;
  callbacks: PrayerTopicCallbacks;
  className?: string;
}

function PrayerTopicCardComponent({ topic, permissions, callbacks, className }: PrayerTopicCardProps) {
  return (
    <AppCard className={className}>
      <AppCardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <button
            type="button"
            onClick={() => callbacks.onView(topic)}
            className="text-left font-medium text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {topic.title}
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label={`Actions pour ${topic.title}`}
                className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <MoreHorizontal className="size-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => callbacks.onView(topic)}>
                <Eye className="size-4" />
                Consulter
              </DropdownMenuItem>
              {permissions.canEdit && (
                <DropdownMenuItem onSelect={() => callbacks.onEdit(topic)}>
                  <Pencil className="size-4" />
                  Modifier
                </DropdownMenuItem>
              )}
              {permissions.canDuplicate && (
                <DropdownMenuItem onSelect={() => callbacks.onDuplicate(topic)}>
                  <Copy className="size-4" />
                  Dupliquer
                </DropdownMenuItem>
              )}
              {permissions.canArchive && topic.status !== "ARCHIVED" && (
                <DropdownMenuItem onSelect={() => callbacks.onArchive(topic)}>
                  <Archive className="size-4" />
                  Archiver
                </DropdownMenuItem>
              )}
              {permissions.canRestore && topic.status === "ARCHIVED" && (
                <DropdownMenuItem onSelect={() => callbacks.onRestore(topic)}>
                  <ArchiveRestore className="size-4" />
                  Restaurer
                </DropdownMenuItem>
              )}
              {permissions.canDelete && (
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onSelect={() => callbacks.onDelete(topic)}
                >
                  <Trash2 className="size-4" />
                  Supprimer
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {topic.description && <p className="line-clamp-2 text-sm text-muted-foreground">{topic.description}</p>}

        <div className="flex flex-wrap gap-1.5">
          <PrayerTopicCategoryBadge category={topic.category} />
          <PrayerTopicPriorityBadge priority={topic.priority} />
          <PrayerTopicStatusBadge status={topic.status} />
        </div>

        <div className="space-y-1 text-xs text-muted-foreground">
          <p className="flex items-center gap-1.5">
            <User className="size-3.5 shrink-0" aria-hidden="true" />
            {topic.authorName}
          </p>
          <p className="flex items-center gap-1.5">
            <CalendarDays className="size-3.5 shrink-0" aria-hidden="true" />
            {formatDate(topic.startDate, "d MMM yyyy")}
            {topic.endDate && ` → ${formatDate(topic.endDate, "d MMM yyyy")}`}
          </p>
        </div>
      </AppCardContent>
    </AppCard>
  );
}

/** Résumé d'un sujet en vue Cartes — actions rapides intégrées (modifier, dupliquer, archiver/restaurer, supprimer). */
export const PrayerTopicCard = React.memo(PrayerTopicCardComponent);
