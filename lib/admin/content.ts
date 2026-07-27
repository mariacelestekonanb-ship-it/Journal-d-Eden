import {
  BookOpen,
  Newspaper,
  BookMarked,
  FolderOpen,
  FolderTree,
  type LucideIcon,
} from "lucide-react";

import {
  analysesRepository,
  categoriesRepository,
  fichesRepository,
  glossaireRepository,
  ressourcesRepository,
} from "@/lib/admin/repository";
import type {
  AdminEntityType,
  AdminStatus,
  AnyAdminContent,
} from "@/lib/admin/types";

/** Segment de route de chaque module admin — partagé par les actions, la recherche et le tableau de bord. */
export const ENTITY_PATHS: Record<AdminEntityType, string> = {
  fiche: "fiches",
  analyse: "veille",
  glossaire: "glossaire",
  ressource: "ressources",
  categorie: "categories",
};

export const ENTITY_LABELS: Record<AdminEntityType, string> = {
  fiche: "Fiche",
  analyse: "Analyse",
  glossaire: "Glossaire",
  ressource: "Ressource",
  categorie: "Catégorie",
};

export const ENTITY_ICONS: Record<AdminEntityType, LucideIcon> = {
  fiche: BookOpen,
  analyse: Newspaper,
  glossaire: BookMarked,
  ressource: FolderOpen,
  categorie: FolderTree,
};

/** Titre lisible d'un contenu admin, quelle que soit l'entité réelle derrière (`question`, `terme` ou `titre`). */
export function titreDe(item: AnyAdminContent): string {
  if ("question" in item) return item.question;
  if ("terme" in item) return item.terme;
  return item.titre;
}

/**
 * Le module Catégories n'a pas de page de détail dédiée (voir
 * `lib/admin/actions.ts` — Créer/Renommer/Fusionner s'y font en place) :
 * son lien pointe toujours vers la liste.
 */
function hrefDe(entity: AdminEntityType, id: string): string {
  return entity === "categorie"
    ? `/admin/categories`
    : `/admin/${ENTITY_PATHS[entity]}/${id}`;
}

export interface AdminContentSummary {
  id: string;
  entity: AdminEntityType;
  titre: string;
  status: AdminStatus;
  updatedAt: string;
  updatedBy: string;
  href: string;
}

/**
 * Vue homogène des cinq dépôts, utilisée par la recherche globale et le
 * tableau de bord — chacun n'a besoin de savoir filtrer/trier une liste
 * plate, jamais de connaître la forme réelle de chaque contenu.
 */
export async function getAllAdminContent(): Promise<AdminContentSummary[]> {
  const [fiches, analyses, glossaire, ressources, categories] =
    await Promise.all([
      fichesRepository.list(),
      analysesRepository.list(),
      glossaireRepository.list(),
      ressourcesRepository.list(),
      categoriesRepository.list(),
    ]);

  const groups: Array<[AdminEntityType, AnyAdminContent[]]> = [
    ["fiche", fiches],
    ["analyse", analyses],
    ["glossaire", glossaire],
    ["ressource", ressources],
    ["categorie", categories],
  ];

  return groups.flatMap(([entity, items]) =>
    items.map((item) => ({
      id: item.id,
      entity,
      titre: titreDe(item),
      status: item.status,
      updatedAt: item.updatedAt,
      updatedBy: item.updatedBy,
      href: hrefDe(entity, item.id),
    })),
  );
}
