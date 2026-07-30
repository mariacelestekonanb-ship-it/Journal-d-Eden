import { ProgramService } from "../services/program.service";
import type { Program } from "../types/planning.types";
import type { ProgramFormValues } from "../validation/program.schema";

export async function updateProgramAction(id: string, values: ProgramFormValues): Promise<Program> {
  return ProgramService.update(id, values);
}
