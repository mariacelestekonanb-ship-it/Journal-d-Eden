"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  archivePrayerTopic,
  createPrayerTopic,
  deletePrayerTopic,
  listPrayerTopics,
  restorePrayerTopic,
  updatePrayerTopic,
} from "../services/prayer-topics.service";
import type { PrayerTopicFormValues } from "../validation/prayer-topic.schema";

export const PRAYER_TOPICS_KEY = ["prayer-topics"] as const;

export function usePrayerTopics() {
  return useQuery({
    queryKey: PRAYER_TOPICS_KEY,
    queryFn: listPrayerTopics,
  });
}

function useInvalidatePrayerTopics() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: PRAYER_TOPICS_KEY });
}

export function useCreatePrayerTopic(createdBy: string) {
  const invalidate = useInvalidatePrayerTopics();
  return useMutation({
    mutationFn: (values: PrayerTopicFormValues) => createPrayerTopic(values, createdBy),
    onSuccess: () => {
      invalidate();
      toast.success("Sujet de prière créé.");
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useUpdatePrayerTopic() {
  const invalidate = useInvalidatePrayerTopics();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: PrayerTopicFormValues }) => updatePrayerTopic(id, values),
    onSuccess: () => {
      invalidate();
      toast.success("Sujet de prière mis à jour.");
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useArchivePrayerTopic() {
  const invalidate = useInvalidatePrayerTopics();
  return useMutation({
    mutationFn: archivePrayerTopic,
    onSuccess: () => {
      invalidate();
      toast.success("Sujet archivé.");
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useRestorePrayerTopic() {
  const invalidate = useInvalidatePrayerTopics();
  return useMutation({
    mutationFn: restorePrayerTopic,
    onSuccess: () => {
      invalidate();
      toast.success("Sujet réactivé.");
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useDeletePrayerTopic() {
  const invalidate = useInvalidatePrayerTopics();
  return useMutation({
    mutationFn: deletePrayerTopic,
    onSuccess: () => {
      invalidate();
      toast.success("Sujet supprimé.");
    },
    onError: (error) => toast.error(error.message),
  });
}
