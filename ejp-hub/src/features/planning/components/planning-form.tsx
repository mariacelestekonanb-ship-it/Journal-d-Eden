"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";

import { AppButton } from "@/shared/components/app-button";
import { DialogFooter } from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";

import { usePlanningConflicts } from "../hooks/use-planning-conflicts";
import {
  usePlanningLeaderOptions,
  usePlanningPrayerTopicOptions,
} from "../hooks/use-planning-slots";
import { DEFAULT_PLANNING_SLOT_FORM_VALUES, planningSlotSchema, type PlanningSlotFormValues } from "../validation/planning-slot.schema";
import { PLANNING_STATUS_LABELS, PLANNING_STATUS_OPTIONS } from "../utils/planning-status";
import { PlanningConflictWarning } from "./planning-conflict-warning";
import { PlanningFormLeaderFields } from "./planning-form-leader-fields";

const NONE_VALUE = "__none__";

export interface PlanningFormProps {
  defaultValues?: Partial<PlanningSlotFormValues>;
  editingSlotId?: string;
  isSubmitting: boolean;
  onSubmit: (values: PlanningSlotFormValues) => void;
  onCancel: () => void;
}

/** Formulaire de création/modification d'un créneau — validation Zod, conflits affichés en direct. */
export function PlanningForm({ defaultValues, editingSlotId, isSubmitting, onSubmit, onCancel }: PlanningFormProps) {
  const { data: leaders } = usePlanningLeaderOptions();
  const { data: topics } = usePlanningPrayerTopicOptions();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<PlanningSlotFormValues>({
    resolver: zodResolver(planningSlotSchema),
    defaultValues: { ...DEFAULT_PLANNING_SLOT_FORM_VALUES, ...defaultValues },
  });

  const watchedValues = watch();
  const conflicts = usePlanningConflicts(
    {
      date: watchedValues.date,
      startTime: watchedValues.startTime,
      endTime: watchedValues.endTime,
      location: watchedValues.location,
      primaryLeaderId: watchedValues.primaryLeaderId,
      secondaryLeaderId: watchedValues.secondaryLeaderId,
    },
    editingSlotId,
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="title">Titre</Label>
        <Input id="title" aria-invalid={!!errors.title} {...register("title")} />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={2} {...register("description")} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-3 space-y-2 sm:col-span-1">
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" aria-invalid={!!errors.date} {...register("date")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="startTime">Heure début</Label>
          <Input id="startTime" type="time" aria-invalid={!!errors.startTime} {...register("startTime")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endTime">Heure fin</Label>
          <Input id="endTime" type="time" aria-invalid={!!errors.endTime} {...register("endTime")} />
        </div>
      </div>
      {errors.endTime && <p className="text-xs text-destructive">{errors.endTime.message}</p>}

      <div className="space-y-2">
        <Label htmlFor="location">Lieu</Label>
        <Input id="location" placeholder="Salle de prière, en ligne…" {...register("location")} />
      </div>

      <PlanningFormLeaderFields control={control} errors={errors} leaders={leaders} />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="theme">Thème</Label>
          <Input id="theme" placeholder="Louange, intercession…" {...register("theme")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="prayerTopicId">Sujet de prière lié</Label>
          <Controller
            control={control}
            name="prayerTopicId"
            render={({ field }) => (
              <Select
                value={field.value || NONE_VALUE}
                onValueChange={(value) => field.onChange(value === NONE_VALUE ? "" : value)}
              >
                <SelectTrigger id="prayerTopicId">
                  <SelectValue placeholder="Aucun" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE_VALUE}>Aucun</SelectItem>
                  {topics?.map((topic) => (
                    <SelectItem key={topic.id} value={topic.id}>
                      {topic.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Statut</Label>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PLANNING_STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {PLANNING_STATUS_LABELS[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Observations</Label>
        <Textarea id="notes" rows={2} {...register("notes")} />
      </div>

      <PlanningConflictWarning conflicts={conflicts} />

      <DialogFooter>
        <AppButton type="button" variant="outline" onClick={onCancel}>
          Annuler
        </AppButton>
        <AppButton type="submit" isLoading={isSubmitting}>
          {editingSlotId ? "Enregistrer" : "Créer"}
        </AppButton>
      </DialogFooter>
    </form>
  );
}
