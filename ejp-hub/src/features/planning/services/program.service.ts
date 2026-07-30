import { isSupabaseConfigured } from "@/shared/lib/supabase/config";

import type { Program } from "../types/planning.types";
import type { ProgramFormValues } from "../validation/program.schema";
import { MockProgramRepository } from "./mock-program-repository";
import type { ProgramRepository } from "./program-repository";
import { SupabaseProgramRepository } from "./supabase-program-repository";

function getRepository(): ProgramRepository {
  return isSupabaseConfigured() ? SupabaseProgramRepository : MockProgramRepository;
}

/** Point d'entrée unique pour toute donnée des programmes — même principe que `PlanningService`. */
export const ProgramService = {
  async list(): Promise<Program[]> {
    return getRepository().list();
  },

  async create(values: ProgramFormValues): Promise<Program> {
    return getRepository().create(values);
  },

  async update(id: string, values: ProgramFormValues): Promise<Program> {
    return getRepository().update(id, values);
  },

  async remove(id: string): Promise<void> {
    return getRepository().remove(id);
  },
};
