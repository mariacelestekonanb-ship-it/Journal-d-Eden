import { ProgramMapper } from "../mappers/program.mapper";
import { createProgramQuery, deleteProgramQuery, queryAllPrograms, updateProgramQuery } from "../queries/program.queries";
import type { ProgramRepository } from "./program-repository";

/** Implémentation réelle de `ProgramRepository`, branchée sur Supabase. */
export const SupabaseProgramRepository: ProgramRepository = {
  async list() {
    const rows = await queryAllPrograms();
    return rows.map(ProgramMapper.toProgram);
  },

  async create(values) {
    const row = await createProgramQuery(values);
    return ProgramMapper.toProgram(row);
  },

  async update(id, values) {
    const row = await updateProgramQuery(id, values);
    return ProgramMapper.toProgram(row);
  },

  async remove(id) {
    await deleteProgramQuery(id);
  },
};
