"use client";

import { motion } from "framer-motion";

import { formatRelative } from "@/shared/utils/format";

import type { ReportTimelineEntry } from "../types/report.types";

export interface ReportTimelineProps {
  entries: ReportTimelineEntry[];
  emptyLabel?: string;
}

/** Timeline verticale de l'historique complet d'un CR — création, modification, soumission, validation, rejet, commentaires. */
export function ReportTimeline({ entries, emptyLabel = "Aucun événement." }: ReportTimelineProps) {
  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  return (
    <ul className="space-y-0">
      {entries.map((entry, index) => (
        <motion.li
          key={entry.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, delay: index * 0.03 }}
          className="relative flex gap-3 pb-4 last:pb-0"
        >
          {index !== entries.length - 1 && (
            <span className="absolute left-4 top-8 h-[calc(100%-1rem)] w-px bg-border" aria-hidden="true" />
          )}
          <span className="z-10 flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-card">
            <entry.icon className="size-4 text-muted-foreground" aria-hidden="true" />
          </span>
          <div className="pt-1.5">
            <p className="text-sm text-foreground">{entry.label}</p>
            {entry.description && <p className="text-xs text-muted-foreground">{entry.description}</p>}
            <p className="text-xs text-muted-foreground">{formatRelative(entry.timestamp)}</p>
          </div>
        </motion.li>
      ))}
    </ul>
  );
}
