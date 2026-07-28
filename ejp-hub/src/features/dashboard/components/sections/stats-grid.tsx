"use client";

import type { Role } from "@/shared/constants/roles";
import { Skeleton } from "@/shared/ui/skeleton";

import { useDashboardStats } from "../../hooks/use-dashboard-stats";
import { StatsCard } from "../stats-card";

export interface StatsGridProps {
  role: Role;
  userId: string;
}

/** Grille des cartes de statistiques, adaptées au rôle courant (ADMIN / PRAYER_LEADER). */
export function StatsGrid({ role, userId }: StatsGridProps) {
  const { data: stats, isLoading, isError } = useDashboardStats(role, userId);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
        Impossible de charger les statistiques pour le moment.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatsCard
          key={stat.id}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          delay={index * 0.05}
        />
      ))}
    </div>
  );
}
