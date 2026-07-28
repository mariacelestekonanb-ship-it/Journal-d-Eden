"use client";

import * as React from "react";

import { PlanningConflictService, type PlanningConflictCandidate } from "../services/planning-conflict.service";
import type { PlanningConflict } from "../types/planning.types";
import { usePlanningSlots } from "./use-planning-slots";

/**
 * Conflits en direct pendant la saisie du formulaire, calculés côté client
 * à partir des créneaux déjà en cache (pas d'aller-retour réseau par
 * frappe). `PlanningService.checkConflicts` reste la vérification faisant
 * foi au moment de l'enregistrement (données fraîches).
 */
export function usePlanningConflicts(
  candidate: Omit<PlanningConflictCandidate, "id"> | null,
  editingSlotId?: string,
): PlanningConflict[] {
  const { data: slots } = usePlanningSlots();

  return React.useMemo(() => {
    if (!candidate || !slots || !candidate.primaryLeaderId) return [];
    return PlanningConflictService.detectConflicts(slots, { ...candidate, id: editingSlotId });
  }, [candidate, slots, editingSlotId]);
}
