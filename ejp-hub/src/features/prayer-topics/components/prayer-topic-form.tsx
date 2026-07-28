"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { AppButton } from "@/shared/components/app-button";
import { DialogFooter } from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";

import { PRAYER_TOPIC_CATEGORY_CONFIG, PRAYER_TOPIC_CATEGORY_OPTIONS } from "../utils/prayer-topic-category";
import { PRAYER_TOPIC_PRIORITY_CONFIG, PRAYER_TOPIC_PRIORITY_OPTIONS } from "../utils/prayer-topic-priority";
import { PRAYER_TOPIC_STATUS_LABELS, PRAYER_TOPIC_STATUS_OPTIONS } from "../utils/prayer-topic-status";
import {
  DEFAULT_PRAYER_TOPIC_FORM_VALUES,
  prayerTopicSchema,
  type PrayerTopicFormValues,
} from "../validation/prayer-topic.schema";

export interface PrayerTopicFormProps {
  defaultValues?: Partial<PrayerTopicFormValues>;
  editingTopicId?: string;
  isSubmitting: boolean;
  onSubmit: (values: PrayerTopicFormValues) => void;
  onCancel: () => void;
}

/** Formulaire de création/modification d'un sujet de prière — validation Zod, messages d'erreur clairs. */
export function PrayerTopicForm({ defaultValues, editingTopicId, isSubmitting, onSubmit, onCancel }: PrayerTopicFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PrayerTopicFormValues>({
    resolver: zodResolver(prayerTopicSchema),
    defaultValues: { ...DEFAULT_PRAYER_TOPIC_FORM_VALUES, ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="title">Titre</Label>
        <Input id="title" aria-invalid={!!errors.title} {...register("title")} />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={3} aria-invalid={!!errors.description} {...register("description")} />
        {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Catégorie</Label>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRAYER_TOPIC_CATEGORY_OPTIONS.map((category) => (
                    <SelectItem key={category} value={category}>
                      {PRAYER_TOPIC_CATEGORY_CONFIG[category].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priorité</Label>
          <Controller
            control={control}
            name="priority"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRAYER_TOPIC_PRIORITY_OPTIONS.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {PRAYER_TOPIC_PRIORITY_CONFIG[priority].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Date début</Label>
          <Input id="startDate" type="date" aria-invalid={!!errors.startDate} {...register("startDate")} />
          {errors.startDate && <p className="text-xs text-destructive">{errors.startDate.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">Date fin</Label>
          <Input id="endDate" type="date" aria-invalid={!!errors.endDate} {...register("endDate")} />
        </div>
      </div>
      {errors.endDate && <p className="text-xs text-destructive">{errors.endDate.message}</p>}

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
                {PRAYER_TOPIC_STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {PRAYER_TOPIC_STATUS_LABELS[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <DialogFooter>
        <AppButton type="button" variant="outline" onClick={onCancel}>
          Annuler
        </AppButton>
        <AppButton type="submit" isLoading={isSubmitting}>
          {editingTopicId ? "Enregistrer" : "Créer"}
        </AppButton>
      </DialogFooter>
    </form>
  );
}
