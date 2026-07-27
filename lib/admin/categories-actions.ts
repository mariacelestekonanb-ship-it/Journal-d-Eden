"use server";

import { revalidatePath } from "next/cache";

import { categoriesRepository } from "@/lib/admin/repository";
import { logActivity } from "@/lib/admin/activity-log";
import { getCurrentAdminUser } from "@/lib/admin/auth";
import { slugifyTerme } from "@/lib/format";
import type { Domaine } from "@/types";

export interface CategorieFormInput {
  /** Absent = création. */
  id?: string;
  titre: string;
  description: string;
  domaine: Domaine;
  icone: string;
}

function revalidateCategories() {
  revalidatePath("/admin/categories");
  revalidatePath("/admin");
}

/** Crée une catégorie ou renomme/modifie une catégorie existante. */
export async function saveCategorie(
  input: CategorieFormInput,
): Promise<{ id: string }> {
  const user = await getCurrentAdminUser();
  const { id: existingId, ...contenu } = input;

  if (!existingId) {
    const id = slugifyTerme(contenu.titre);
    const created = await categoriesRepository.create({
      ...contenu,
      id,
      slug: id,
      nombreArticles: 0,
      status: "publie",
      updatedAt: new Date().toISOString().slice(0, 10),
      updatedBy: user.nom,
      versions: [],
    });
    revalidateCategories();
    await logActivity({
      auteur: user.nom,
      action: "a créé",
      entityType: "categorie",
      titre: created.titre,
      href: "/admin/categories",
    });
    return { id: created.id };
  }

  await categoriesRepository.update(existingId, {
    ...contenu,
    updatedAt: new Date().toISOString().slice(0, 10),
    updatedBy: user.nom,
  });
  revalidateCategories();
  await logActivity({
    auteur: user.nom,
    action: "a renommé/modifié",
    entityType: "categorie",
    titre: contenu.titre,
    href: "/admin/categories",
  });

  return { id: existingId };
}

/**
 * Fusionne deux catégories : la catégorie source est supprimée, son
 * nombre d'articles est reporté sur la catégorie cible (les fiches et
 * analyses qui la référencent conservent leur `categorie` d'origine tant
 * qu'aucune base réelle n'assure la réaffectation en cascade).
 */
export async function mergeCategories(
  sourceId: string,
  targetId: string,
): Promise<void> {
  const [source, target] = await Promise.all([
    categoriesRepository.get(sourceId),
    categoriesRepository.get(targetId),
  ]);
  if (!source || !target || source.id === target.id) return;

  const user = await getCurrentAdminUser();

  await categoriesRepository.update(targetId, {
    nombreArticles: target.nombreArticles + source.nombreArticles,
    updatedAt: new Date().toISOString().slice(0, 10),
    updatedBy: user.nom,
  });
  await categoriesRepository.remove(sourceId);

  revalidateCategories();
  await logActivity({
    auteur: user.nom,
    action: `a fusionné « ${source.titre} » dans`,
    entityType: "categorie",
    titre: target.titre,
    href: "/admin/categories",
  });
}

/** Réorganise l'ordre d'affichage des catégories (échange avec le voisin). */
export async function reorderCategorie(
  id: string,
  direction: -1 | 1,
): Promise<void> {
  await categoriesRepository.reorder(id, direction);
  revalidateCategories();
}
