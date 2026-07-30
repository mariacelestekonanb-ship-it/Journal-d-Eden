import { ProgramService } from "../services/program.service";

export async function deleteProgramAction(id: string): Promise<void> {
  return ProgramService.remove(id);
}
