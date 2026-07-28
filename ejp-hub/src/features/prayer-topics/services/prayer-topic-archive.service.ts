import type { PrayerTopic } from "../types/prayer-topic.types";

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Détecte les sujets arrivés à échéance (`endDate` dépassée) mais pas
 * encore archivés — utilisée pour proposer un archivage groupé depuis la
 * liste. Fonctions pures, opérant sur des sujets déjà chargés (aucun appel
 * réseau supplémentaire) et testables indépendamment de toute source de
 * données (mock ou Supabase).
 *
 * Volontairement non destructif : ce service ne modifie jamais les données
 * lui-même — l'archivage effectif reste une action explicite de
 * l'utilisateur (bouton « Archiver les sujets expirés »), via
 * `PrayerTopicService.archive`.
 */
export const PrayerTopicArchiveService = {
  isExpired(topic: PrayerTopic, referenceDate: string = todayIso()): boolean {
    if (topic.status === "ARCHIVED") return false;
    if (!topic.endDate) return false;
    return topic.endDate < referenceDate;
  },

  findExpiredTopics(topics: PrayerTopic[], referenceDate: string = todayIso()): PrayerTopic[] {
    return topics.filter((topic) => this.isExpired(topic, referenceDate));
  },
};
