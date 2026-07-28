"use client";

import { BookHeart, CalendarClock, FileText, Sparkles } from "lucide-react";
import Link from "next/link";

import { SlotCard } from "@/features/planning/components/slot-card";
import { formatRelative } from "@/lib/format";
import { EmptyState } from "@/shared/components/states/empty-state";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

import {
  useActiveTopicsCount,
  usePendingReportsCount,
  useRecentTestimonies,
  useUpcomingSlots,
} from "../hooks/use-dashboard";
import { StatCard } from "./stat-card";

export function DashboardView({ userId, isAdmin, fullName }: { userId: string; isAdmin: boolean; fullName: string }) {
  const upcomingSlots = useUpcomingSlots(userId, isAdmin);
  const activeTopics = useActiveTopicsCount();
  const pendingReports = usePendingReportsCount(userId, isAdmin);
  const recentTestimonies = useRecentTestimonies();

  const firstName = fullName.split(" ")[0];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Bonjour {firstName} 👋</h1>
        <p className="text-sm text-muted-foreground">Voici un aperçu de la vie de prière de l&apos;EJP.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={CalendarClock}
          label="Prochains créneaux"
          value={upcomingSlots.data?.length ?? 0}
          isLoading={upcomingSlots.isLoading}
        />
        <StatCard
          icon={Sparkles}
          label="Sujets de prière actifs"
          value={activeTopics.data ?? 0}
          isLoading={activeTopics.isLoading}
        />
        <StatCard
          icon={FileText}
          label="Comptes rendus en attente"
          value={pendingReports.data ?? 0}
          isLoading={pendingReports.isLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Prochains créneaux</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/planning">Voir le planning</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcomingSlots.data && upcomingSlots.data.length === 0 && (
              <EmptyState
                icon={CalendarClock}
                title="Aucun créneau à venir"
                description={isAdmin ? "Planifiez le prochain temps de prière." : "Aucun créneau ne vous est assigné."}
              />
            )}
            {upcomingSlots.data?.map((slot) => <SlotCard key={slot.id} slot={slot} />)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Derniers témoignages</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/temoignages">Voir tout</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTestimonies.data && recentTestimonies.data.length === 0 && (
              <EmptyState
                icon={BookHeart}
                title="Aucun témoignage"
                description="Les témoignages partagés par la communauté apparaîtront ici."
              />
            )}
            {recentTestimonies.data?.map((testimony) => (
              <div key={testimony.id} className="space-y-0.5 border-b border-border pb-3 last:border-0 last:pb-0">
                <p className="text-sm font-medium text-foreground">{testimony.title}</p>
                <p className="line-clamp-2 text-sm text-muted-foreground">{testimony.content}</p>
                <p className="text-xs text-muted-foreground">
                  {testimony.author.full_name} · {formatRelative(testimony.created_at)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
