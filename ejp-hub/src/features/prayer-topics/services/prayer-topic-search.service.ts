import { PRAYER_TOPIC_CATEGORY_CONFIG } from "../utils/prayer-topic-category";
import type { PrayerTopic, PrayerTopicFilters } from "../types/prayer-topic.types";

/**
 * Recherche avancée et filtres combinables des Sujets de prière — fonction
 * pure, testable indépendamment de toute source de données. La recherche
 * textuelle couvre le titre, la description, l'auteur et le libellé de
 * catégorie (pas seulement la valeur d'enum).
 */
export const PrayerTopicSearchService = {
  search(topics: PrayerTopic[], filters: PrayerTopicFilters): PrayerTopic[] {
    const search = filters.search.trim().toLowerCase();

    return topics.filter((topic) => {
      if (search) {
        const haystack = `${topic.title} ${topic.description ?? ""} ${topic.authorName} ${PRAYER_TOPIC_CATEGORY_CONFIG[topic.category].label}`.toLowerCase();
        if (!haystack.includes(search)) return false;
      }
      if (filters.category && topic.category !== filters.category) return false;
      if (filters.priority && topic.priority !== filters.priority) return false;
      if (filters.status && topic.status !== filters.status) return false;
      if (filters.authorId && topic.authorId !== filters.authorId) return false;
      if (filters.dateFrom && topic.startDate < filters.dateFrom) return false;
      if (filters.dateTo && topic.startDate > filters.dateTo) return false;
      return true;
    });
  },
};
