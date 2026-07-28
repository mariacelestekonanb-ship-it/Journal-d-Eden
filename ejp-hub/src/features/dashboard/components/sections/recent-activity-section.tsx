"use client";

import { Activity } from "lucide-react";

import { AppEmptyState } from "@/shared/components/app-empty-state";
import { Skeleton } from "@/shared/ui/skeleton";

import { useRecentActivity } from "../../hooks/use-recent-activity";
import { ActivityItem } from "../activity-item";
import { DashboardCard } from "../dashboard-card";

/** Section « Activité récente » : timeline des derniers événements de l'organisation. */
export function RecentActivitySection() {
  const { data: entries, isLoading } = useRecentActivity();

  return (
    <DashboardCard title="Activité récente" icon={Activity} delay={0.25}>
      {isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      )}
      {!isLoading && entries?.length === 0 && (
        <AppEmptyState
          icon={Activity}
          title="Aucune activité récente"
          description="Les actions de la communauté (comptes rendus, témoignages, sujets) apparaîtront ici."
        />
      )}
      {!isLoading && entries && entries.length > 0 && (
        <ol className="pt-1">
          {entries.map((entry, index) => (
            <ActivityItem key={entry.id} entry={entry} isLast={index === entries.length - 1} />
          ))}
        </ol>
      )}
    </DashboardCard>
  );
}
