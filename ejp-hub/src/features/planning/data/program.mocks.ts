import type { PlanningProgramRef, Program } from "../types/planning.types";

/**
 * Fixtures de démonstration des programmes. Utilisées par
 * `MockProgramRepository` (et par `planning.mocks.ts` pour rattacher
 * certains créneaux fictifs à un programme) tant que Supabase n'est pas
 * configuré.
 */
export const MOCK_PROGRAM_REFS: PlanningProgramRef[] = [
  { id: "program-jeunesse", name: "Programme Jeunesse" },
  { id: "program-guerison", name: "Programme Guérison" },
];

function daysAgo(count: number): string {
  return new Date(Date.now() - count * 86_400_000).toISOString();
}

export const INITIAL_MOCK_PROGRAMS: Program[] = [
  {
    id: "program-jeunesse",
    name: "Programme Jeunesse",
    description: "Chaîne de prière dédiée aux jeunes de l'église, animée par une équipe de conducteurs dédiée.",
    members: [
      { id: "leader-marie", fullName: "Marie Petit" },
      { id: "leader-jean", fullName: "Jean Martin" },
    ],
    createdAt: daysAgo(30),
    updatedAt: daysAgo(30),
  },
  {
    id: "program-guerison",
    name: "Programme Guérison",
    description: "Prières d'intercession régulières pour les malades.",
    members: [
      { id: "leader-alice", fullName: "Alice Administrateur" },
      { id: "leader-sarah", fullName: "Sarah Nguyen" },
    ],
    createdAt: daysAgo(20),
    updatedAt: daysAgo(20),
  },
];
