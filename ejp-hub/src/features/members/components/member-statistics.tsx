"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, ShieldAlert, Users, type LucideIcon } from "lucide-react";

import { AppCard } from "@/shared/components/app-card";
import { Skeleton } from "@/shared/ui/skeleton";

import type { MemberStatsSummary } from "../types/member.types";

export interface MemberStatisticsProps {
  stats: MemberStatsSummary;
  isLoading?: boolean;
}

interface Tile {
  label: string;
  value: string;
  icon: LucideIcon;
}

/** Ligne d'indicateurs du module — total, actifs, en attente, suspendus. */
export function MemberStatistics({ stats, isLoading }: MemberStatisticsProps) {
  const tiles: Tile[] = [
    { label: "Membres", value: String(stats.totalCount), icon: Users },
    { label: "Actifs", value: String(stats.activeCount), icon: CheckCircle2 },
    { label: "Demandes en attente", value: String(stats.pendingCount), icon: Clock },
    { label: "Suspendus", value: String(stats.suspendedCount), icon: ShieldAlert },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
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
