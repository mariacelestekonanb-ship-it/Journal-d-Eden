"use client";

import { CalendarDays, MapPin, User } from "lucide-react";

import type { Role } from "@/shared/constants/roles";
import { AppEmptyState } from "@/shared/components/app-empty-state";
import { Skeleton } from "@/shared/ui/skeleton";
import { formatDate, formatTime } from "@/shared/utils/format";

import { useUpcomingSlots } from "../../hooks/use-upcoming-slots";
import type { UpcomingSlotSummary } from "../../types/dashboard.types";
import { DashboardCard } from "../dashboard-card";

function UpcomingSlotRow({ slot }: { slot: UpcomingSlotSummary }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-foreground">
          {formatDate(slot.date, "EEEE d MMMM")} · {formatTime(slot.startTime)}–{formatTime(slot.endTime)}
        </p>
      </div>
      <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {slot.topicTitle && <span>{slot.topicTitle}</span>}
        <span className="flex items-center gap-1">
          <User className="size-3" aria-hidden="true" />
          {slot.leaderName ?? "Non assigné"}
        </span>
        {slot.location && (
          <span className="flex items-center gap-1">
            <MapPin className="size-3" aria-hidden="true" />
            {slot.location}
          </span>
        )}
      </div>
    </div>
  );
}

export interface UpcomingSlotsSectionProps {
  role: Role;
  userId: string;
}

/** Section « Prochaines conduites » : date, heure, lieu, sujet et responsable de chaque créneau. */
export function UpcomingSlotsSection({ role, userId }: UpcomingSlotsSectionProps) {
  const { data: slots, isLoading } = useUpcomingSlots(role, userId);

  return (
    <DashboardCard title="Prochaines conduites" icon={CalendarDays} delay={0.1}>
      {isLoading && (
        <div className="space-y-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      )}
      {!isLoading && slots?.length === 0 && (
        <AppEmptyState
          icon={CalendarDays}
          title="Aucune conduite à venir"
          description="Les prochains créneaux de prière apparaîtront ici dès qu'ils seront planifiés."
        />
      )}
      {!isLoading && slots && slots.length > 0 && (
        <div className="space-y-2">
          {slots.map((slot) => (
            <UpcomingSlotRow key={slot.id} slot={slot} />
          ))}
        </div>
      )}
    </DashboardCard>
  );
}
