import { TestimonyMapper } from "../mappers/testimony.mapper";
import { createTestimonyQuery, deleteTestimonyQuery, queryAllTestimonies } from "../queries/testimony.queries";
import type { TestimonyRepository } from "./testimony-repository";

/**
 * Implémentation réelle de `TestimonyRepository`, branchée sur Supabase.
 * Utilisée dès que `isSupabaseConfigured()` renvoie `true` (voir
 * `getRepository()` dans `testimony.service.ts`). La RLS (`testimonies_select`,
 * `testimonies_insert_own`, `testimonies_update_own_or_admin`,
 * `testimonies_delete_own_or_admin`) applique déjà toutes les règles —
 * aucune logique d'isolation à reproduire ici.
 */
export const SupabaseTestimonyRepository: TestimonyRepository = {
  async list() {
    const rows = await queryAllTestimonies();
    return rows.map(TestimonyMapper.toTestimony);
  },

  async create(values, authorId) {
    const row = await createTestimonyQuery(values, authorId);
    return TestimonyMapper.toTestimony(row);
  },

  async remove(id) {
    await deleteTestimonyQuery(id);
  },
};
