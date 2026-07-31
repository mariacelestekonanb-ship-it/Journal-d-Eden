import { INITIAL_MOCK_TESTIMONIES } from "../data/testimony.mocks";
import type { Testimony } from "../types/testimony.types";
import type { TestimonyRepository } from "./testimony-repository";

/**
 * Implémentation en mémoire de `TestimonyRepository`, utilisée tant que
 * Supabase n'est pas configuré. L'état est mutable au niveau du module pour
 * que créer/supprimer restent réellement interactifs en mode démo.
 */
let testimonies: Testimony[] = INITIAL_MOCK_TESTIMONIES.map((testimony) => ({ ...testimony }));

export const MockTestimonyRepository: TestimonyRepository = {
  async list() {
    return testimonies.map((testimony) => ({ ...testimony }));
  },

  async create(values, authorId, authorName) {
    const now = new Date().toISOString();
    const created: Testimony = {
      id: crypto.randomUUID(),
      title: values.title,
      content: values.content,
      author: { id: authorId, fullName: authorName },
      createdAt: now,
      updatedAt: now,
    };
    testimonies = [created, ...testimonies];
    return created;
  },

  async remove(id) {
    testimonies = testimonies.filter((testimony) => testimony.id !== id);
  },
};
