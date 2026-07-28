"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";

import { formatDate, formatTime } from "@/lib/format";
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
import { Textarea } from "@/shared/components/ui/textarea";

import { useCreateReport, useUpdateReport } from "../hooks/use-reports";
import type { PendingSlot, ReportWithSlot } from "../types/report.types";
import { reportSchema, type ReportFormValues } from "../validation/report.schema";

interface ReportFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  pendingSlot?: PendingSlot;
  existingReport?: ReportWithSlot;
}

export function ReportFormDialog({ open, onOpenChange, userId, pendingSlot, existingReport }: ReportFormDialogProps) {
  const slot = pendingSlot ?? existingReport?.slot;
  const isEditing = !!existingReport;
  const createMutation = useCreateReport(userId);
  const updateMutation = useUpdateReport();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      attendees_count: existingReport?.attendees_count ?? undefined,
      topics_covered: existingReport?.topics_covered ?? "",
      content: existingReport?.content ?? "",
      follow_up: existingReport?.follow_up ?? "",
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({
        attendees_count: existingReport?.attendees_count ?? undefined,
        topics_covered: existingReport?.topics_covered ?? "",
        content: existingReport?.content ?? "",
        follow_up: existingReport?.follow_up ?? "",
      });
    }
  }, [open, existingReport, reset]);

  async function onSubmit(values: ReportFormValues) {
    if (isEditing) {
      await updateMutation.mutateAsync({ id: existingReport.id, values });
    } else if (pendingSlot) {
      await createMutation.mutateAsync({ slotId: pendingSlot.id, values });
    }
    onOpenChange(false);
  }

  if (!slot) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Compte rendu du {formatDate(slot.slot_date, "dd/MM/yyyy")}</DialogTitle>
          <DialogDescription>
            {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
            {slot.topic ? ` · ${slot.topic.title}` : ""}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="attendees_count">Nombre de présents</Label>
            <Input id="attendees_count" type="number" min={0} {...register("attendees_count")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="topics_covered">Sujets abordés</Label>
            <Textarea id="topics_covered" rows={2} {...register("topics_covered")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Compte rendu</Label>
            <Textarea
              id="content"
              rows={5}
              aria-invalid={!!errors.content}
              placeholder="Déroulement du temps de prière, points marquants…"
              {...register("content")}
            />
            {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="follow_up">Suivi à prévoir</Label>
            <Textarea id="follow_up" rows={2} {...register("follow_up")} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
