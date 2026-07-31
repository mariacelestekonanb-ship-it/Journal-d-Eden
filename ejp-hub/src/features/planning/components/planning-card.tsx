import { CalendarDays, MapPin, Sparkles, User } from "lucide-react";
import * as React from "react";

import { cn } from "@/shared/lib/utils";
import { AppCard, AppCardContent } from "@/shared/components/app-card";
import { formatDate, formatTime } from "@/shared/utils/format";

import type { PrayerSlot } from "../types/planning.types";
import { PlanningStatusBadge } from "./planning-status-badge";

export interface PlanningCardProps {
  slot: PrayerSlot;
  onClick?: () => void;
  className?: string;
}

function PlanningCardContent({ slot }: { slot: PrayerSlot }) {
  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium text-foreground">{slot.title}</p>
        <PlanningStatusBadge status={slot.status} className="shrink-0" />
      </div>

      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
        <CalendarDays className="size-3.5 shrink-0" aria-hidden="true" />
        {formatDate(slot.date, "EEEE d MMMM")} · {formatTime(slot.startTime)}–{formatTime(slot.endTime)}
      </p>

      {slot.location && (
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
          {slot.location}
        </p>
      )}

      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
        <User className="size-3.5 shrink-0" aria-hidden="true" />
        <span className={slot.primaryLeader?.isActive === false ? "italic opacity-60" : undefined}>
          {slot.primaryLeader?.fullName ?? "Non assigné"}
        </span>
        {slot.secondaryLeader && (
          <span className={slot.secondaryLeader.isActive === false ? "italic opacity-60" : undefined}>
            {" "}
            · {slot.secondaryLeader.fullName}
          </span>
        )}
      </p>

      {(slot.theme || slot.prayerTopic) && (
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Sparkles className="size-3.5 shrink-0" aria-hidden="true" />
          {[slot.theme, slot.prayerTopic?.title].filter(Boolean).join(" · ")}
        </p>
      )}
    </>
  );
}

/**
 * Résumé compact d'un créneau — utilisé pour l'aperçu rapide (clic sur un
 * événement du calendrier) et réutilisable partout où un créneau doit être
 * présenté brièvement (mobile, futurs modules Comptes rendus/Notifications).
 */
function PlanningCardComponent({ slot, onClick, className }: PlanningCardProps) {
  return (
    <AppCard className={className}>
      <AppCardContent className={cn("space-y-1 p-4", onClick && "cursor-pointer")}>
        {onClick ? (
          <button type="button" onClick={onClick} className="w-full text-left focus-visible:outline-none">
            <PlanningCardContent slot={slot} />
          </button>
        ) : (
          <PlanningCardContent slot={slot} />
        )}
      </AppCardContent>
    </AppCard>
  );
}

export const PlanningCard = React.memo(PlanningCardComponent);
