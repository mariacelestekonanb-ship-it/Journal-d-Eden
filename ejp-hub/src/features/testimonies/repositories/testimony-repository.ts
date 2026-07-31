import type { Testimony } from "../types/testimony.types";
import type { TestimonyFormValues } from "../validation/testimony.schema";

/**
 * Contrat d'accès aux données des Témoignages, indépendant de la source
 * réelle. `TestimonyService` ne dépend que de cette interface — jamais
 * d'une implémentation concrète — pour que brancher Supabase se limite à
 * changer `getRepository()` (voir `testimony.service.ts`), sans toucher au
 * reste du module.
 *
 * Aucune isolation par auteur ici (contrairement aux Comptes rendus) : tout
 * témoignage est visible par tout utilisateur connecté — c'est le principe
 * même du module (voir TESTIMONIES.md).
 */
export interface TestimonyRepository {
  list(): Promise<Testimony[]>;
  create(values: TestimonyFormValues, authorId: string, authorName: string): Promise<Testimony>;
  remove(id: string): Promise<void>;
}
