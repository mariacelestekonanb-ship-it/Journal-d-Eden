"use client";

import { CalendarDays, Copy, MapPin, Pencil, Sparkles, User, XCircle } from "lucide-react";
import * as React from "react";

import { AppButton } from "@/shared/components/app-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { formatDate, formatTime } from "@/shared/utils/format";

import { useCreateSlot, useUpdateSlot } from "../hooks/use-planning-mutations";
import type { PrayerSlot } from "../types/planning.types";
import { mapSlotToFormValues } from "../utils/map-slot-to-form-values";
import type { PlanningPermissions } from "../utils/planning-permissions";
import type { PlanningSlotFormValues } from "../validation/planning-slot.schema";
import { PlanningForm } from "./planning-form";
import { PlanningStatusBadge } from "./planning-status-badge";

export type PlanningDialogMode = "create" | "edit" | "view";

export interface PlanningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: PlanningDialogMode;
  slot?: PrayerSlot;
  defaultDate?: string;
  permissions: PlanningPermissions;
  onEditRequested: (slot: PrayerSlot) => void;
  onDuplicateRequested: (slot: PrayerSlot) => void;
  onCancelRequested: (slot: PrayerSlot) => void;
  onDeleteRequested: (slot: PrayerSlot) => void;
}

/** Détail en lecture seule d'un créneau — l'aperçu rapide du calendrier ET le mode « Consulter » de la liste. */
function SlotDetails({ slot }: { slot: PrayerSlot }) {
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-2">
        {slot.description && <p className="text-sm text-muted-foreground">{slot.description}</p>}
        <PlanningStatusBadge status={slot.status} className="shrink-0" />
      </div>
      <dl className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-foreground">
          <CalendarDays className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span>
            {formatDate(slot.date, "EEEE d MMMM yyyy")} · {formatTime(slot.startTime)}–{formatTime(slot.endTime)}
          </span>
        </div>
        {slot.location && (
          <div className="flex items-center gap-2 text-foreground">
            <MapPin className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span>{slot.location}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-foreground">
          <User className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span>
            {slot.primaryLeader?.fullName ?? "Non assigné"}
            {slot.secondaryLeader && ` · ${slot.secondaryLeader.fullName} (secondaire)`}
          </span>
        </div>
        {(slot.theme || slot.prayerTopic) && (
          <div className="flex items-center gap-2 text-foreground">
            <Sparkles className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span>{[slot.theme, slot.prayerTopic?.title].filter(Boolean).join(" · ")}</span>
          </div>
        )}
      </dl>
      {slot.notes && (
        <div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide">Observations</p>
          {slot.notes}
        </div>
      )}
    </div>
  );
}

export function PlanningDialog({
  open,
  onOpenChange,
  mode,
  slot,
  defaultDate,
  permissions,
  onEditRequested,
  onDuplicateRequested,
  onCancelRequested,
  onDeleteRequested,
}: PlanningDialogProps) {
  const createMutation = useCreateSlot();
  const updateMutation = useUpdateSlot();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  async function handleSubmit(values: PlanningSlotFormValues) {
    if (mode === "edit" && slot) {
      await updateMutation.mutateAsync({ id: slot.id, values });
    } else {
      await createMutation.mutateAsync(values);
    }
    onOpenChange(false);
  }

  const defaultValues = React.useMemo<Partial<PlanningSlotFormValues> | undefined>(() => {
    if (mode === "edit" && slot) return mapSlotToFormValues(slot);
    if (mode === "create" && defaultDate) return { date: defaultDate };
    return undefined;
  }, [mode, slot, defaultDate]);

  const title = mode === "create" ? "Nouveau créneau" : mode === "edit" ? "Modifier le créneau" : (slot?.title ?? "Créneau");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {mode !== "view" && (
            <DialogDescription>
              Les conflits de conducteur ou de lieu sont détectés automatiquement pendant la saisie.
            </DialogDescription>
          )}
        </DialogHeader>

        {mode === "view" && slot ? (
          <>
            <SlotDetails slot={slot} />
            <DialogFooter className="flex-wrap gap-2 sm:justify-between">
              <div className="flex flex-wrap gap-2">
                {permissions.canEdit && (
                  <AppButton variant="outline" size="sm" onClick={() => onEditRequested(slot)}>
                    <Pencil className="size-4" />
                    Modifier
                  </AppButton>
                )}
                {permissions.canDuplicate && (
                  <AppButton variant="outline" size="sm" onClick={() => onDuplicateRequested(slot)}>
                    <Copy className="size-4" />
                    Dupliquer
                  </AppButton>
                )}
                {permissions.canCancel && slot.status !== "CANCELLED" && (
                  <AppButton variant="outline" size="sm" onClick={() => onCancelRequested(slot)}>
                    <XCircle className="size-4" />
                    Annuler le créneau
                  </AppButton>
                )}
              </div>
              {permissions.canDelete && (
                <AppButton variant="destructive" size="sm" onClick={() => onDeleteRequested(slot)}>
                  Supprimer
                </AppButton>
              )}
            </DialogFooter>
          </>
        ) : (
          <PlanningForm
            defaultValues={defaultValues}
            editingSlotId={mode === "edit" ? slot?.id : undefined}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
