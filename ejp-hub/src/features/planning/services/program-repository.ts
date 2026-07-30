import type { Program } from "../types/planning.types";
import type { ProgramFormValues } from "../validation/program.schema";

/**
 * Contrat d'accès aux données des programmes, indépendant de la source
 * réelle — même principe que `PlanningRepository`.
 */
export interface ProgramRepository {
  list(): Promise<Program[]>;
  create(values: ProgramFormValues): Promise<Program>;
  update(id: string, values: ProgramFormValues): Promise<Program>;
  remove(id: string): Promise<void>;
}
