import { MOCK_LEADERS } from "../data/planning.mocks";
import { INITIAL_MOCK_PROGRAMS } from "../data/program.mocks";
import type { Program } from "../types/planning.types";
import type { ProgramRepository } from "./program-repository";

/** Implémentation en mémoire de `ProgramRepository`, utilisée tant que Supabase n'est pas configuré. */
let programs: Program[] = INITIAL_MOCK_PROGRAMS.map((program) => ({ ...program, members: [...program.members] }));

function resolveMembers(memberIds: string[]): Program["members"] {
  return memberIds
    .map((id) => MOCK_LEADERS.find((leader) => leader.id === id))
    .filter((leader): leader is NonNullable<typeof leader> => !!leader)
    .map((leader) => ({ id: leader.id, fullName: leader.fullName }));
}

function requireProgram(id: string): Program {
  const found = programs.find((program) => program.id === id);
  if (!found) throw new Error("Programme introuvable.");
  return found;
}

export const MockProgramRepository: ProgramRepository = {
  async list() {
    return programs.map((program) => ({ ...program, members: [...program.members] }));
  },

  async create(values) {
    const now = new Date().toISOString();
    const created: Program = {
      id: crypto.randomUUID(),
      name: values.name,
      description: values.description || null,
      members: resolveMembers(values.memberIds),
      createdAt: now,
      updatedAt: now,
    };
    programs = [...programs, created];
    return created;
  },

  async update(id, values) {
    const existing = requireProgram(id);
    const updated: Program = {
      ...existing,
      name: values.name,
      description: values.description || null,
      members: resolveMembers(values.memberIds),
      updatedAt: new Date().toISOString(),
    };
    programs = programs.map((program) => (program.id === id ? updated : program));
    return updated;
  },

  async remove(id) {
    programs = programs.filter((program) => program.id !== id);
  },
};
