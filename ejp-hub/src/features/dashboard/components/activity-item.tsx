"use client";

import { motion } from "framer-motion";

import { formatRelative } from "@/shared/utils/format";

import type { ActivityLogEntry } from "../types/dashboard.types";

export interface ActivityItemProps {
  entry: ActivityLogEntry;
  /** Masque la ligne verticale de la timeline pour la dernière entrée. */
  isLast?: boolean;
}

/**
 * Une ligne de la timeline « Activité récente ». Générique et sans
 * dépendance au Dashboard — réutilisable dans tout autre module affichant
 * un historique d'événements (ex. futur détail d'un sujet de prière).
 */
export function ActivityItem({ entry, isLast = false }: ActivityItemProps) {
  const Icon = entry.icon;

  return (
    <motion.li
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className="relative flex gap-3 pb-4 last:pb-0"
    >
      {!isLast && <span className="absolute left-4 top-8 h-[calc(100%-1rem)] w-px bg-border" aria-hidden="true" />}
      <span className="z-10 flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-card">
        <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
      </span>
      <p className="pt-1.5 text-sm text-foreground">
        <span className="font-medium">{entry.actorName}</span> {entry.action}
        <span className="ml-2 text-xs text-muted-foreground">{formatRelative(entry.timestamp)}</span>
      </p>
    </motion.li>
  );
}
