"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Plus } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";

import type { PlanningSlotWithRelations } from "../types/planning.types";
import { SlotCard } from "./slot-card";

interface DaySlotsDialogProps {
  date: Date | null;
  slots: PlanningSlotWithRelations[];
  isAdmin: boolean;
  onOpenChange: (open: boolean) => void;
  onSlotClick: (slot: PlanningSlotWithRelations) => void;
  onAddSlot: (date: Date) => void;
}

export function DaySlotsDialog({ date, slots, isAdmin, onOpenChange, onSlotClick, onAddSlot }: DaySlotsDialogProps) {
  if (!date) return null;
  const dayKey = format(date, "yyyy-MM-dd");
  const daySlots = slots.filter((slot) => slot.slot_date === dayKey);

  return (
    <Dialog open={!!date} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="capitalize">{format(date, "EEEE d MMMM yyyy", { locale: fr })}</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {daySlots.map((slot) => (
            <SlotCard key={slot.id} slot={slot} onClick={() => onSlotClick(slot)} />
          ))}
          {daySlots.length === 0 && <p className="text-sm text-muted-foreground">Aucun créneau ce jour-là.</p>}
        </div>
        {isAdmin && (
          <Button variant="outline" onClick={() => onAddSlot(date)}>
            <Plus className="size-4" />
            Ajouter un créneau
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
