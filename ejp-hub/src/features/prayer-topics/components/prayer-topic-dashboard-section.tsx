"use client";

import dynamic from "next/dynamic";

import { AppCard, AppCardContent, AppCardHeader, AppCardTitle } from "@/shared/components/app-card";
import { Skeleton } from "@/shared/ui/skeleton";

import type { PrayerTopicStatsSummary, PrayerTopicTimelineEntry } from "../types/prayer-topic.types";
import { PrayerTopicStats } from "./prayer-topic-stats";
import { PrayerTopicTimeline } from "./prayer-topic-timeline";

const PrayerTopicEvolutionChart = dynamic(
  () => import("./prayer-topic-evolution-chart").then((mod) => mod.PrayerTopicEvolutionChart),
  { ssr: false, loading: () => <Skeleton className="h-[180px] w-full" /> },
);

export interface PrayerTopicDashboardSectionProps {
  stats: PrayerTopicStatsSummary;
  isStatsLoading: boolean;
  recentEntries: PrayerTopicTimelineEntry[];
}

/** Tableau de bord du module : indicateurs, évolution mensuelle et derniers sujets créés. */
export function PrayerTopicDashboardSection({ stats, isStatsLoading, recentEntries }: PrayerTopicDashboardSectionProps) {
  return (
    <div className="space-y-4">
      <PrayerTopicStats stats={stats} isLoading={isStatsLoading} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AppCard className="p-4">
          <AppCardHeader className="p-0 pb-2">
            <AppCardTitle className="text-sm font-medium text-muted-foreground">Évolution (6 derniers mois)</AppCardTitle>
          </AppCardHeader>
          <AppCardContent className="p-0">
            <PrayerTopicEvolutionChart data={stats.evolution} />
          </AppCardContent>
        </AppCard>

        <AppCard className="p-4">
          <AppCardHeader className="p-0 pb-2">
            <AppCardTitle className="text-sm font-medium text-muted-foreground">Derniers sujets</AppCardTitle>
          </AppCardHeader>
          <AppCardContent className="max-h-[220px] overflow-y-auto p-0">
            <PrayerTopicTimeline entries={recentEntries} emptyLabel="Aucun sujet créé pour le moment." />
          </AppCardContent>
        </AppCard>
      </div>
    </div>
  );
}
