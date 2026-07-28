"use client";

import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { Plus } from "lucide-react";

import { formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";

import type { PlanningSlotWithRelations } from "../types/planning.types";

const WEEKDAY_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MAX_VISIBLE_SLOTS = 3;

interface MonthViewProps {
  monthDate: Date;
  slots: PlanningSlotWithRelations[];
  isAdmin: boolean;
  onSlotClick: (slot: PlanningSlotWithRelations) => void;
  onAddSlot: (date: Date) => void;
  onShowMore: (date: Date) => void;
}

export function MonthView({ monthDate, slots, isAdmin, onSlotClick, onAddSlot, onShowMore }: MonthViewProps) {
  const gridStart = startOfWeek(startOfMonth(monthDate), { weekStartsOn: 1 });
  const gridEnd = endOfWeek(endOfMonth(monthDate), { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="grid grid-cols-7 border-b border-border bg-muted/40">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="px-2 py-2 text-center text-xs font-medium uppercase text-muted-foreground">
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const dayKey = format(day, "yyyy-MM-dd");
          const daySlots = slots.filter((slot) => slot.slot_date === dayKey);
          const visibleSlots = daySlots.slice(0, MAX_VISIBLE_SLOTS);
          const hiddenCount = daySlots.length - visibleSlots.length;

          return (
            <div
              key={dayKey}
              className={cn(
                "group flex min-h-24 flex-col gap-1 border-b border-r border-border p-1.5 last:border-r-0",
                !isSameMonth(day, monthDate) && "bg-muted/20",
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full text-xs font-medium",
                    isToday(day) ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                    !isSameMonth(day, monthDate) && "opacity-40",
                  )}
                >
                  {format(day, "d")}
                </span>
                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-5 opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="Ajouter un créneau"
                    onClick={() => onAddSlot(day)}
                  >
                    <Plus className="size-3" />
                  </Button>
                )}
              </div>
              <div className="flex flex-col gap-0.5">
                {visibleSlots.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => onSlotClick(slot)}
                    className="truncate rounded bg-accent px-1.5 py-0.5 text-left text-[11px] font-medium text-accent-foreground hover:bg-accent/70"
                  >
                    {formatTime(slot.start_time)} {slot.conducteur?.full_name ?? "Non assigné"}
                  </button>
                ))}
                {hiddenCount > 0 && (
                  <button
                    type="button"
                    onClick={() => onShowMore(day)}
                    className="px-1.5 text-left text-[11px] text-muted-foreground hover:text-foreground"
                  >
                    +{hiddenCount} autre{hiddenCount > 1 ? "s" : ""}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
