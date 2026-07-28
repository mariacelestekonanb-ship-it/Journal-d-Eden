"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { archiveTopicAction } from "../actions/archive-topic.action";
import { createTopicAction } from "../actions/create-topic.action";
import { deleteTopicAction } from "../actions/delete-topic.action";
import { duplicateTopicAction } from "../actions/duplicate-topic.action";
import { restoreTopicAction } from "../actions/restore-topic.action";
import { updateTopicAction } from "../actions/update-topic.action";
import type { PrayerTopicAuthorOption } from "../types/prayer-topic.types";
import type { PrayerTopicFormValues } from "../validation/prayer-topic.schema";
import { PRAYER_TOPICS_KEY } from "./use-prayer-topics";

function useInvalidatePrayerTopics() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: PRAYER_TOPICS_KEY });
}

export function useCreateTopic() {
  const invalidate = useInvalidatePrayerTopics();
  return useMutation({
    mutationFn: ({ values, author }: { values: PrayerTopicFormValues; author: PrayerTopicAuthorOption }) =>
      createTopicAction(values, author),
    onSuccess: () => {
      invalidate();
      toast.success("Sujet de prière créé.");
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useUpdateTopic() {
  const invalidate = useInvalidatePrayerTopics();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: PrayerTopicFormValues }) => updateTopicAction(id, values),
    onSuccess: () => {
      invalidate();
      toast.success("Sujet de prière mis à jour.");
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useDeleteTopic() {
  const invalidate = useInvalidatePrayerTopics();
  return useMutation({
    mutationFn: (id: string) => deleteTopicAction(id),
    onSuccess: () => {
      invalidate();
      toast.success("Sujet de prière supprimé.");
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useDuplicateTopic() {
  const invalidate = useInvalidatePrayerTopics();
  return useMutation({
    mutationFn: (id: string) => duplicateTopicAction(id),
    onSuccess: () => {
      invalidate();
      toast.success("Sujet de prière dupliqué.");
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useArchiveTopic() {
  const invalidate = useInvalidatePrayerTopics();
  return useMutation({
    mutationFn: (id: string) => archiveTopicAction(id),
    onSuccess: () => {
      invalidate();
      toast.success("Sujet de prière archivé.");
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useRestoreTopic() {
  const invalidate = useInvalidatePrayerTopics();
  return useMutation({
    mutationFn: (id: string) => restoreTopicAction(id),
    onSuccess: () => {
      invalidate();
      toast.success("Sujet de prière restauré.");
    },
    onError: (error) => toast.error(error.message),
  });
}

/** Archivage groupé des sujets expirés détectés par `PrayerTopicArchiveService`. */
export function useArchiveExpiredTopics() {
  const invalidate = useInvalidatePrayerTopics();
  return useMutation({
    mutationFn: (ids: string[]) => Promise.all(ids.map((id) => archiveTopicAction(id))),
    onSuccess: (archived) => {
      invalidate();
      toast.success(`${archived.length} sujet${archived.length > 1 ? "s" : ""} expiré${archived.length > 1 ? "s" : ""} archivé${archived.length > 1 ? "s" : ""}.`);
    },
    onError: (error) => toast.error(error.message),
  });
}
