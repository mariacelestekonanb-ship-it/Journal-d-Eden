"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";

import { usePrayerTopics } from "@/features/prayer-topics/hooks/use-prayer-topics";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";

import { useActiveConducteurs, useCreateSlot, useUpdateSlot } from "../hooks/use-planning";
import type { PlanningSlotWithRelations } from "../types/planning.types";
import { planningSlotSchema, type PlanningSlotFormValues } from "../validation/planning-slot.schema";

interface SlotFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slot?: PlanningSlotWithRelations;
  defaultDate?: string;
}

export function SlotFormDialog({ open, onOpenChange, slot, defaultDate }: SlotFormDialogProps) {
  const isEditing = !!slot;
  const { data: conducteurs } = useActiveConducteurs();
  const { data: topics } = usePrayerTopics();
  const createMutation = useCreateSlot();
  const updateMutation = useUpdateSlot();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const defaultValues: PlanningSlotFormValues = {
    slot_date: slot?.slot_date ?? defaultDate ?? new Date().toISOString().slice(0, 10),
    start_time: slot?.start_time.slice(0, 5) ?? "18:00",
    end_time: slot?.end_time.slice(0, 5) ?? "19:00",
    conducteur_id: slot?.conducteur_id ?? "",
    prayer_topic_id: slot?.prayer_topic_id ?? "",
    location: slot?.location ?? "",
    notes: slot?.notes ?? "",
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<PlanningSlotFormValues>({
    resolver: zodResolver(planningSlotSchema),
    defaultValues,
  });

  React.useEffect(() => {
    if (open) reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, slot, defaultDate]);

  async function onSubmit(values: PlanningSlotFormValues) {
    if (isEditing) {
      await updateMutation.mutateAsync({ id: slot.id, values });
    } else {
      await createMutation.mutateAsync(values);
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Modifier le créneau" : "Nouveau créneau"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-3 space-y-2 sm:col-span-1">
              <Label htmlFor="slot_date">Date</Label>
              <Input id="slot_date" type="date" aria-invalid={!!errors.slot_date} {...register("slot_date")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="start_time">Début</Label>
              <Input id="start_time" type="time" aria-invalid={!!errors.start_time} {...register("start_time")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_time">Fin</Label>
              <Input id="end_time" type="time" aria-invalid={!!errors.end_time} {...register("end_time")} />
            </div>
          </div>
          {errors.end_time && <p className="text-xs text-destructive">{errors.end_time.message}</p>}

          <div className="space-y-2">
            <Label htmlFor="conducteur_id">Conducteur de prière</Label>
            <Controller
              control={control}
              name="conducteur_id"
              render={({ field }) => (
                <Select value={field.value || undefined} onValueChange={field.onChange}>
                  <SelectTrigger id="conducteur_id">
                    <SelectValue placeholder="Non assigné" />
                  </SelectTrigger>
                  <SelectContent>
                    {conducteurs?.map((conducteur) => (
                      <SelectItem key={conducteur.id} value={conducteur.id}>
                        {conducteur.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prayer_topic_id">Sujet de prière lié</Label>
            <Controller
              control={control}
              name="prayer_topic_id"
              render={({ field }) => (
                <Select value={field.value || undefined} onValueChange={field.onChange}>
                  <SelectTrigger id="prayer_topic_id">
                    <SelectValue placeholder="Aucun sujet lié" />
                  </SelectTrigger>
                  <SelectContent>
                    {topics
                      ?.filter((topic) => topic.status === "actif")
                      .map((topic) => (
                        <SelectItem key={topic.id} value={topic.id}>
                          {topic.title}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Lieu</Label>
            <Input id="location" placeholder="Salle de prière, en ligne…" {...register("location")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" rows={2} {...register("notes")} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              {isEditing ? "Enregistrer" : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
