import type { Database } from "@/types/database";

export type PlanningSlot = Database["public"]["Tables"]["planning_slots"]["Row"];

export interface PlanningSlotWithRelations extends PlanningSlot {
  conducteur: { id: string; full_name: string } | null;
  topic: { id: string; title: string } | null;
}

export interface ConducteurOption {
  id: string;
  full_name: string;
}

export type PlanningView = "semaine" | "mois";
