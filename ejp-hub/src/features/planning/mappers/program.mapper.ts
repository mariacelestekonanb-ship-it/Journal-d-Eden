import { getFullName } from "@/shared/utils/get-full-name";

import type { RawProgramRow } from "../queries/program.queries";
import type { Program } from "../types/planning.types";

/** Convertit les lignes brutes de `program.queries.ts` en `Program`. */
export const ProgramMapper = {
  toProgram(row: RawProgramRow): Program {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      members: row.members.map(({ member }) => ({ id: member.id, fullName: getFullName(member) })),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  },
};
