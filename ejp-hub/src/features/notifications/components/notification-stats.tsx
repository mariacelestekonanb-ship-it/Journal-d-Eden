"use client";

import { motion } from "framer-motion";
import { Bell, CalendarDays, CalendarRange, type LucideIcon } from "lucide-react";

import { AppCard } from "@/shared/components/app-card";
import { Skeleton } from "@/shared/ui/skeleton";

import type { NotificationStatsSummary } from "../types/notification.types";

export interface NotificationStatsProps {
  stats: NotificationStatsSummary;
  isLoading?: boolean;
}

interface Tile {
  label: string;
  value: string;
  icon: LucideIcon;
}

/** Ligne d'indicateurs du module — non lues, aujourd'hui, cette semaine. */
export function NotificationStats({ stats, isLoading }: NotificationStatsProps) {
  const tiles: Tile[] = [
    { label: "Non lues", value: String(stats.unreadCount), icon: Bell },
    { label: "Aujourd'hui", value: String(stats.todayCount), icon: CalendarDays },
    { label: "Cette semaine", value: String(stats.thisWeekCount), icon: CalendarRange },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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
