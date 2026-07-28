"use client";

import { HeartHandshake } from "lucide-react";

import { AppEmptyState } from "@/shared/components/app-empty-state";
import { Skeleton } from "@/shared/ui/skeleton";

import { useRecentTopics } from "../../hooks/use-recent-topics";
import { DashboardCard } from "../dashboard-card";
import { PrayerTopicCard } from "../prayer-topic-card";

/** Section « Derniers sujets de prière » : les 5 sujets les plus récents, tous rôles confondus. */
export function RecentTopicsSection() {
  const { data: topics, isLoading } = useRecentTopics();

  return (
    <DashboardCard title="Derniers sujets de prière" icon={HeartHandshake} delay={0.15}>
      {isLoading && (
        <div className="space-y-2">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      )}
      {!isLoading && topics?.length === 0 && (
        <AppEmptyState
          icon={HeartHandshake}
          title="Aucun sujet de prière"
          description="Les sujets publiés par les administrateurs apparaîtront ici."
        />
      )}
      {!isLoading && topics && topics.length > 0 && (
        <div className="space-y-2">
          {topics.map((topic) => (
            <PrayerTopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      )}
    </DashboardCard>
  );
}
