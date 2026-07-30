import { ProgramService } from "../services/program.service";
import type { Program } from "../types/planning.types";
import type { ProgramFormValues } from "../validation/program.schema";

export async function createProgramAction(values: ProgramFormValues): Promise<Program> {
  return ProgramService.create(values);
}
