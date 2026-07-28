import type { PlanningConflict, PrayerSlot } from "../types/planning.types";

export interface PlanningConflictCandidate {
  /** Absent lors d'une création — permet d'exclure le créneau lui-même lors d'une modification. */
  id?: string;
  date: string;
  startTime: string;
  endTime: string;
  location?: string | null;
  primaryLeaderId: string;
  secondaryLeaderId?: string | null;
}

function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return aStart < bEnd && bStart < aEnd;
}

function isCandidateItself(slot: PrayerSlot, candidateId?: string): boolean {
  return candidateId !== undefined && slot.id === candidateId;
}

/**
 * Détecte les conflits d'un créneau candidat par rapport aux créneaux
 * existants — utilisé par le formulaire (avertissement en direct) et par
 * `PlanningService` avant toute création/modification. Fonctions pures,
 * testables indépendamment de toute source de données (mock ou Supabase).
 */
export const PlanningConflictService = {
  detectInvalidTimeRange(candidate: PlanningConflictCandidate): PlanningConflict | null {
    if (candidate.endTime <= candidate.startTime) {
      return {
        type: "INVALID_TIME_RANGE",
        message: "L'heure de fin doit être postérieure à l'heure de début.",
        conflictingSlotIds: [],
      };
    }
    return null;
  },

  /** Deux créneaux non annulés, au même lieu, sur des horaires qui se chevauchent le même jour. */
  detectDoubleBooking(existingSlots: PrayerSlot[], candidate: PlanningConflictCandidate): PlanningConflict | null {
    if (!candidate.location) return null;

    const conflicting = existingSlots.filter(
      (slot) =>
        !isCandidateItself(slot, candidate.id) &&
        slot.status !== "CANCELLED" &&
        slot.date === candidate.date &&
        slot.location === candidate.location &&
        overlaps(candidate.startTime, candidate.endTime, slot.startTime, slot.endTime),
    );

    if (conflicting.length === 0) return null;
    return {
      type: "DOUBLE_BOOKING",
      message: `Le lieu « ${candidate.location} » est déjà réservé sur ce créneau horaire par ${conflicting.length} autre créneau${conflicting.length > 1 ? "x" : ""}.`,
      conflictingSlotIds: conflicting.map((slot) => slot.id),
    };
  },

  /** Un conducteur (principal ou secondaire) déjà affecté à un autre créneau qui chevauche celui-ci. */
  detectLeaderConflict(existingSlots: PrayerSlot[], candidate: PlanningConflictCandidate): PlanningConflict | null {
    const candidateLeaderIds = [candidate.primaryLeaderId, candidate.secondaryLeaderId].filter(
      (id): id is string => !!id,
    );
    if (candidateLeaderIds.length === 0) return null;

    const conflicting = existingSlots.filter((slot) => {
      if (isCandidateItself(slot, candidate.id) || slot.status === "CANCELLED") return false;
      if (slot.date !== candidate.date) return false;
      if (!overlaps(candidate.startTime, candidate.endTime, slot.startTime, slot.endTime)) return false;

      const slotLeaderIds = [slot.primaryLeader?.id, slot.secondaryLeader?.id].filter((id): id is string => !!id);
      return slotLeaderIds.some((id) => candidateLeaderIds.includes(id));
    });

    if (conflicting.length === 0) return null;
    return {
      type: "LEADER_CONFLICT",
      message: "Un des conducteurs assignés est déjà affecté à un autre créneau sur ce même horaire.",
      conflictingSlotIds: conflicting.map((slot) => slot.id),
    };
  },

  detectConflicts(existingSlots: PrayerSlot[], candidate: PlanningConflictCandidate): PlanningConflict[] {
    return [
      this.detectInvalidTimeRange(candidate),
      this.detectDoubleBooking(existingSlots, candidate),
      this.detectLeaderConflict(existingSlots, candidate),
    ].filter((conflict): conflict is PlanningConflict => conflict !== null);
  },
};
