import { INITIAL_MOCK_REPLACEMENT_REQUESTS } from "../data/replacement-request.mocks";
import { MOCK_LEADERS } from "../data/planning.mocks";
import type { ReplacementRequest } from "../types/planning.types";
import { mockReassignSlotLeader } from "./mock-planning-repository";
import type { ReplacementRequestRepository } from "./replacement-request-repository";

let requests: ReplacementRequest[] = INITIAL_MOCK_REPLACEMENT_REQUESTS.map((request) => ({ ...request }));

function findMember(id: string) {
  const found = MOCK_LEADERS.find((candidate) => candidate.id === id);
  if (!found) throw new Error("Membre introuvable.");
  return found;
}

function requireRequest(id: string): ReplacementRequest {
  const found = requests.find((request) => request.id === id);
  if (!found) throw new Error("Demande de remplacement introuvable.");
  return found;
}

/** Implémentation en mémoire de `ReplacementRequestRepository` — même principe que `MockPlanningRepository`. */
export const MockReplacementRequestRepository: ReplacementRequestRepository = {
  async listForSlot(planningId) {
    return requests.filter((request) => request.planningId === planningId).map((request) => ({ ...request }));
  },

  async create(input) {
    const created: ReplacementRequest = {
      id: crypto.randomUUID(),
      planningId: input.planningId,
      role: input.role,
      requestedBy: findMember(input.requestedBy),
      proposedMember: findMember(input.proposedMemberId),
      comment: input.comment,
      status: "PENDING",
      createdAt: new Date().toISOString(),
      decidedAt: null,
    };
    requests = [created, ...requests];
    return created;
  },

  async decide(id, decision) {
    const existing = requireRequest(id);
    const updated: ReplacementRequest = { ...existing, status: decision, decidedAt: new Date().toISOString() };
    requests = requests.map((request) => (request.id === id ? updated : request));

    if (decision === "APPROVED") {
      mockReassignSlotLeader(existing.planningId, existing.role, existing.proposedMember.id);
    }

    return updated;
  },

  async cancel(id) {
    requests = requests.filter((request) => request.id !== id);
  },
};
