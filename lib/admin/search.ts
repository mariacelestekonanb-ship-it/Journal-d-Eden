"use server";

import { getAllAdminContent } from "@/lib/admin/content";
import type { AdminEntityType, AdminStatus } from "@/lib/admin/types";

export interface AdminSearchResult {
  id: string;
  entity: AdminEntityType;
  titre: string;
  status: AdminStatus;
  href: string;
}

/**
 * Recherche globale du back-office : interroge les cinq dépôts (via
 * `getAllAdminContent`) et ne garde que les titres correspondants.
 * Contrairement à la recherche publique (`lib/search.ts`), celle-ci porte
 * aussi sur les brouillons et contenus archivés — c'est un outil de
 * travail, pas une découverte de contenu public.
 */
export async function searchAdminContent(
  query: string,
): Promise<AdminSearchResult[]> {
  const normalized = query.trim().toLowerCase();
  if (normalized.length === 0) return [];

  const content = await getAllAdminContent();

  return content
    .filter((item) => item.titre.toLowerCase().includes(normalized))
    .map(({ id, entity, titre, status, href }) => ({
      id,
      entity,
      titre,
      status,
      href,
    }));
}
