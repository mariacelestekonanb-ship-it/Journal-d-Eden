import { isSupabaseConfigured } from "@/shared/lib/supabase/config";

import { MockTestimonyRepository } from "../repositories/mock-testimony-repository";
import type { TestimonyRepository } from "../repositories/testimony-repository";
import { SupabaseTestimonyRepository } from "../repositories/supabase-testimony-repository";
import type { Testimony } from "../types/testimony.types";
import type { TestimonyFormValues } from "../validation/testimony.schema";

/**
 * Point d'entrée unique pour toute donnée des Témoignages. Les composants et
 * hooks ne connaissent que cette interface — jamais `TestimonyRepository`,
 * `testimony.queries.ts` ni le client Supabase directement.
 */
function getRepository(): TestimonyRepository {
  return isSupabaseConfigured() ? SupabaseTestimonyRepository : MockTestimonyRepository;
}

export const TestimonyService = {
  async list(): Promise<Testimony[]> {
    return getRepository().list();
  },

  async create(values: TestimonyFormValues, authorId: string, authorName: string): Promise<Testimony> {
    return getRepository().create(values, authorId, authorName);
  },

  async remove(id: string): Promise<void> {
    return getRepository().remove(id);
  },
};
