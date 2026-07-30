import type { ReplacementRequest } from "../types/planning.types";
import { MOCK_LEADERS } from "./planning.mocks";

function leader(id: string) {
  const found = MOCK_LEADERS.find((candidate) => candidate.id === id);
  if (!found) throw new Error(`Conducteur fictif inconnu : ${id}`);
  return found;
}

/** Une demande de remplacement fictive, en attente, pour illustrer le volet admin en mode démo. */
export const INITIAL_MOCK_REPLACEMENT_REQUESTS: ReplacementRequest[] = [
  {
    id: "replacement-1",
    planningId: "slot-4",
    role: "PRAYER_LEADER",
    requestedBy: leader("leader-marc"),
    proposedMember: leader("leader-jean"),
    comment: "Jean est disponible et a déjà conduit ce type de créneau.",
    status: "PENDING",
    createdAt: new Date(Date.now() - 20_000_000).toISOString(),
    decidedAt: null,
  },
];
