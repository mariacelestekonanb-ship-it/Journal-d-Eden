"use client";

import { MapPin, Sparkles, UserRound } from "lucide-react";

import { formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";

import type { PlanningSlotWithRelations } from "../types/planning.types";

export function SlotCard({
  slot,
  onClick,
  compact = false,
}: {
  slot: PlanningSlotWithRelations;
  onClick?: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-lg border border-border bg-card px-2.5 py-2 text-left text-xs shadow-sm transition-colors hover:border-primary/50 hover:bg-accent/50",
        !slot.conducteur && "border-dashed",
      )}
    >
      <p className="font-medium text-foreground">
        {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
      </p>
      {!compact && (
        <div className="mt-1 space-y-0.5 text-muted-foreground">
          <p className="flex items-center gap-1">
            <UserRound className="size-3 shrink-0" />
            <span className="truncate">{slot.conducteur?.full_name ?? "Non assigné"}</span>
          </p>
          {slot.topic && (
            <p className="flex items-center gap-1">
              <Sparkles className="size-3 shrink-0" />
              <span className="truncate">{slot.topic.title}</span>
            </p>
          )}
          {slot.location && (
            <p className="flex items-center gap-1">
              <MapPin className="size-3 shrink-0" />
              <span className="truncate">{slot.location}</span>
            </p>
          )}
        </div>
      )}
    </button>
  );
}
