import { ReplacementRequestMapper } from "../mappers/replacement-request.mapper";
import {
  cancelReplacementRequestQuery,
  createReplacementRequestQuery,
  decideReplacementRequestQuery,
  queryReplacementRequestsForSlot,
} from "../queries/replacement-request.queries";
import type { ReplacementRequestRepository } from "./replacement-request-repository";

/**
 * Implémentation réelle de `ReplacementRequestRepository`, branchée sur
 * Supabase. L'approbation d'une demande réassigne réellement le créneau —
 * ce comportement vit dans le trigger Postgres `notify_replacement_decision`
 * (voir `supabase/migrations/20260812090001_slot_assignment_responses.sql`),
 * pas ici : il doit s'appliquer même si la décision est prise directement en
 * base (SQL manuel), pas seulement depuis cette action.
 */
export const SupabaseReplacementRequestRepository: ReplacementRequestRepository = {
  async listForSlot(planningId) {
    const rows = await queryReplacementRequestsForSlot(planningId);
    return rows.map(ReplacementRequestMapper.toReplacementRequest);
  },

  async create(input) {
    const row = await createReplacementRequestQuery(input);
    return ReplacementRequestMapper.toReplacementRequest(row);
  },

  async decide(id, decision, decidedBy) {
    const row = await decideReplacementRequestQuery(id, decision, decidedBy);
    return ReplacementRequestMapper.toReplacementRequest(row);
  },

  async cancel(id) {
    await cancelReplacementRequestQuery(id);
  },
};
