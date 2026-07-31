import { getFullName } from "@/shared/utils/get-full-name";

import type { RawTestimonyRow } from "../queries/testimony.queries";
import type { Testimony } from "../types/testimony.types";

/**
 * Convertit les lignes brutes de `testimony.queries.ts` en `Testimony` (le
 * modèle métier utilisé par tous les composants). Isole le reste du module
 * de la forme exacte de la table — un renommage de colonne ne touche que ce
 * fichier.
 */
export const TestimonyMapper = {
  toTestimony(row: RawTestimonyRow): Testimony {
    return {
      id: row.id,
      title: row.title,
      content: row.content,
      author: row.author
        ? { id: row.author.id, fullName: getFullName(row.author), isActive: row.author.is_active }
        : { id: "", fullName: "Auteur inconnu" },
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  },
};
