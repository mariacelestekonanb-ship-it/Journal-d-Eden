"use client";

import { format, startOfMonth, subMonths } from "date-fns";
import { fr } from "date-fns/locale";
import * as React from "react";

import type { PrayerTopic, PrayerTopicStatsSummary } from "../types/prayer-topic.types";
import { usePrayerTopics } from "./use-prayer-topics";

const EVOLUTION_MONTHS = 6;

/** Répartition mensuelle des créations sur les 6 derniers mois — alimente le graphique d'évolution du tableau de bord du module. */
function computeEvolution(topics: PrayerTopic[]): { label: string; count: number }[] {
  const now = new Date();
  const months = Array.from({ length: EVOLUTION_MONTHS }, (_, index) =>
    startOfMonth(subMonths(now, EVOLUTION_MONTHS - 1 - index)),
  );

  return months.map((monthStart) => {
    const monthKey = format(monthStart, "yyyy-MM");
    const count = topics.filter((topic) => topic.createdAt.slice(0, 7) === monthKey).length;
    return { label: format(monthStart, "MMM", { locale: fr }), count };
  });
}

/** Calcule les indicateurs du module à partir des sujets déjà en cache — aucun appel réseau supplémentaire. */
export function computePrayerTopicStats(topics: PrayerTopic[]): PrayerTopicStatsSummary {
  return {
    activeCount: topics.filter((topic) => topic.status === "ACTIVE").length,
    archivedCount: topics.filter((topic) => topic.status === "ARCHIVED").length,
    urgentCount: topics.filter((topic) => topic.priority === "URGENT" && topic.status !== "ARCHIVED").length,
    draftCount: topics.filter((topic) => topic.status === "DRAFT").length,
    evolution: computeEvolution(topics),
  };
}

export function usePrayerTopicStats() {
  const { data: topics, isLoading } = usePrayerTopics();

  const stats = React.useMemo(() => computePrayerTopicStats(topics ?? []), [topics]);

  return { stats, isLoading };
}
