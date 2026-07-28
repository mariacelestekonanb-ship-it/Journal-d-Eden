"use client";

import { eachDayOfInterval, format, isToday } from "date-fns";
import { fr } from "date-fns/locale";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";

import type { PlanningSlotWithRelations } from "../types/planning.types";
import { SlotCard } from "./slot-card";

interface WeekViewProps {
  weekStart: Date;
  weekEnd: Date;
  slots: PlanningSlotWithRelations[];
  isAdmin: boolean;
  onSlotClick: (slot: PlanningSlotWithRelations) => void;
  onAddSlot: (date: Date) => void;
}

export function WeekView({ weekStart, weekEnd, slots, isAdmin, onSlotClick, onAddSlot }: WeekViewProps) {
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
      {days.map((day) => {
        const dayKey = format(day, "yyyy-MM-dd");
        const daySlots = slots.filter((slot) => slot.slot_date === dayKey);

        return (
          <div
            key={dayKey}
            className={cn(
              "flex min-h-40 flex-col gap-2 rounded-xl border border-border bg-card p-3",
              isToday(day) && "border-primary/50 bg-accent/30",
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {format(day, "EEEE", { locale: fr })}
                </p>
                <p className={cn("text-sm font-semibold", isToday(day) && "text-primary")}>
                  {format(day, "d MMMM", { locale: fr })}
                </p>
              </div>
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  aria-label="Ajouter un créneau"
                  onClick={() => onAddSlot(day)}
                >
                  <Plus className="size-3.5" />
                </Button>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-2">
              {daySlots.length === 0 ? (
                <p className="mt-2 text-center text-xs text-muted-foreground">Aucun créneau</p>
              ) : (
                daySlots.map((slot) => <SlotCard key={slot.id} slot={slot} onClick={() => onSlotClick(slot)} />)
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
