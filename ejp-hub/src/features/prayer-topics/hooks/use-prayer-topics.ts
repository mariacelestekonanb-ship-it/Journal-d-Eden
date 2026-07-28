"use client";

import { useQuery } from "@tanstack/react-query";

import { PrayerTopicService } from "../services/prayer-topic.service";

export const PRAYER_TOPICS_KEY = ["prayer-topics", "list"] as const;

export function usePrayerTopics() {
  return useQuery({
    queryKey: PRAYER_TOPICS_KEY,
    queryFn: () => PrayerTopicService.list(),
  });
}

export function usePrayerTopicAuthorOptions() {
  return useQuery({
    queryKey: ["prayer-topics", "author-options"],
    queryFn: () => PrayerTopicService.listAuthorOptions(),
    staleTime: 5 * 60 * 1000,
  });
}
