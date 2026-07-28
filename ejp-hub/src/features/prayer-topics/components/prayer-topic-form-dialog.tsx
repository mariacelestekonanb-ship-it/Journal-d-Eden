"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";

import { useCreatePrayerTopic, useUpdatePrayerTopic } from "../hooks/use-prayer-topics";
import type { PrayerTopic } from "../types/prayer-topic.types";
import { prayerTopicSchema, type PrayerTopicFormValues } from "../validation/prayer-topic.schema";

interface PrayerTopicFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserId: string;
  topic?: PrayerTopic;
}

export function PrayerTopicFormDialog({ open, onOpenChange, currentUserId, topic }: PrayerTopicFormDialogProps) {
  const isEditing = !!topic;
  const createMutation = useCreatePrayerTopic(currentUserId);
  const updateMutation = useUpdatePrayerTopic();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<PrayerTopicFormValues>({
    resolver: zodResolver(prayerTopicSchema),
    defaultValues: {
      title: topic?.title ?? "",
      description: topic?.description ?? "",
      priority: topic?.priority ?? "moyenne",
      start_date: topic?.start_date ?? new Date().toISOString().slice(0, 10),
      end_date: topic?.end_date ?? "",
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({
        title: topic?.title ?? "",
        description: topic?.description ?? "",
        priority: topic?.priority ?? "moyenne",
        start_date: topic?.start_date ?? new Date().toISOString().slice(0, 10),
        end_date: topic?.end_date ?? "",
      });
    }
  }, [open, topic, reset]);

  async function onSubmit(values: PrayerTopicFormValues) {
    if (isEditing) {
      await updateMutation.mutateAsync({ id: topic.id, values });
    } else {
      await createMutation.mutateAsync(values);
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Modifier le sujet de prière" : "Nouveau sujet de prière"}</DialogTitle>
          <DialogDescription>
            Renseignez le sujet, sa priorité et sa période de suivi. Il sera archivé automatiquement après sa
            date de fin.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input id="title" aria-invalid={!!errors.title} {...register("title")} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={3} {...register("description")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                      <SelectItem value="haute">Haute</SelectItem>
                      <SelectItem value="moyenne">Moyenne</SelectItem>
                      <SelectItem value="basse">Basse</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Date de début</Label>
              <Input id="start_date" type="date" aria-invalid={!!errors.start_date} {...register("start_date")} />
              {errors.start_date && <p className="text-xs text-destructive">{errors.start_date.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">Date de fin (optionnelle)</Label>
              <Input id="end_date" type="date" aria-invalid={!!errors.end_date} {...register("end_date")} />
              {errors.end_date && <p className="text-xs text-destructive">{errors.end_date.message}</p>}
            </div>
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
