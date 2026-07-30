import { getFullName } from "@/shared/utils/get-full-name";

import type { RawPlanningLeader, RawPlanningRow } from "../queries/planning.queries";
import type { PlanningParticipant, PrayerSlot } from "../types/planning.types";

function toParticipant(leader: RawPlanningLeader | null): PlanningParticipant | null {
  return leader ? { id: leader.id, fullName: getFullName(leader) } : null;
}

/**
 * Convertit les lignes brutes de `planning.queries.ts` en `PrayerSlot`
 * (le modèle métier utilisé par tous les composants). Isole le reste du
 * module de la forme exacte de la table — un renommage de colonne ne
 * touche que ce fichier.
 */
export const PlanningMapper = {
  toPrayerSlot(row: RawPlanningRow): PrayerSlot {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      date: row.slot_date,
      startTime: row.start_time,
      endTime: row.end_time,
      location: row.location,
      primaryLeader: toParticipant(row.primary_leader),
      secondaryLeader: toParticipant(row.secondary_leader),
      status: row.status,
      theme: row.theme,
      prayerTopic: row.prayer_topic,
      program: row.program,
      notes: row.notes,
      prayerLeaderResponse: row.prayer_leader_response,
      prayerLeaderResponseComment: row.prayer_leader_response_comment,
      prayerLeaderResponseAt: row.prayer_leader_response_at,
      secondaryLeaderResponse: row.secondary_leader_response,
      secondaryLeaderResponseComment: row.secondary_leader_response_comment,
      secondaryLeaderResponseAt: row.secondary_leader_response_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  },
};
