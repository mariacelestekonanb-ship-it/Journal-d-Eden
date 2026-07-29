"use client";

import { useUser } from "@/features/auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { getFullName } from "@/shared/utils/get-full-name";

import { useCreateTopic, useUpdateTopic } from "../hooks/use-prayer-topic-mutations";
import type { PrayerTopic } from "../types/prayer-topic.types";
import { mapTopicToFormValues } from "../utils/map-topic-to-form-values";
import type { PrayerTopicFormValues } from "../validation/prayer-topic.schema";
import { PrayerTopicForm } from "./prayer-topic-form";

export type PrayerTopicDialogMode = "create" | "edit";

export interface PrayerTopicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: PrayerTopicDialogMode;
  topic?: PrayerTopic;
}

/** Création/modification d'un sujet de prière — la consultation vit dans `PrayerTopicDetailDrawer`. */
export function PrayerTopicDialog({ open, onOpenChange, mode, topic }: PrayerTopicDialogProps) {
  const { profile } = useUser();
  const createMutation = useCreateTopic();
  const updateMutation = useUpdateTopic();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  async function handleSubmit(values: PrayerTopicFormValues) {
    if (mode === "edit" && topic) {
      await updateMutation.mutateAsync({ id: topic.id, values });
    } else if (profile) {
      await createMutation.mutateAsync({ values, author: { id: profile.id, fullName: getFullName(profile) } });
    }
    onOpenChange(false);
  }

  const defaultValues = mode === "edit" && topic ? mapTopicToFormValues(topic) : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Nouveau sujet de prière" : "Modifier le sujet"}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Décrivez le sujet à porter en prière par la communauté."
              : "Mettez à jour les informations de ce sujet."}
          </DialogDescription>
        </DialogHeader>
        <PrayerTopicForm
          defaultValues={defaultValues}
          editingTopicId={mode === "edit" ? topic?.id : undefined}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
