"use client";

import { motion } from "framer-motion";
import { Archive, CheckCircle2, Clock, FileEdit, XCircle, type LucideIcon } from "lucide-react";

import { AppCard } from "@/shared/components/app-card";
import { Skeleton } from "@/shared/ui/skeleton";

import type { ReportStatsSummary } from "../types/report.types";

export interface ReportStatisticsProps {
  stats: ReportStatsSummary;
  isLoading?: boolean;
}

interface Tile {
  label: string;
  value: string;
  icon: LucideIcon;
}

/** Ligne d'indicateurs du module — CR en attente, validés, rejetés, brouillons et délai moyen de validation. */
export function ReportStatistics({ stats, isLoading }: ReportStatisticsProps) {
  const tiles: Tile[] = [
    { label: "En attente", value: String(stats.pendingCount), icon: Clock },
    { label: "Validés", value: String(stats.validatedCount), icon: CheckCircle2 },
    { label: "Rejetés", value: String(stats.rejectedCount), icon: XCircle },
    { label: "Brouillons", value: String(stats.draftCount), icon: FileEdit },
    {
      label: "Délai moyen de validation",
      value: stats.averageValidationHours === null ? "—" : `${stats.averageValidationHours} h`,
      icon: Archive,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {tiles.map((tile, index) => (
        <motion.div
          key={tile.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
        >
          <AppCard className="p-4" role="group" aria-label={`${tile.label} : ${isLoading ? "chargement" : tile.value}`}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{tile.label}</p>
              <span className="flex size-8 items-center justify-center rounded-lg bg-accent" aria-hidden="true">
                <tile.icon className="size-4 text-accent-foreground" />
              </span>
            </div>
            {isLoading ? (
              <Skeleton className="mt-3 h-8 w-12" />
            ) : (
              <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{tile.value}</p>
            )}
          </AppCard>
        </motion.div>
      ))}
    </div>
  );
}
