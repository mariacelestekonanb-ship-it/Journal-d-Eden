import { categories } from "@/data/categories";
import { veilleItems } from "@/data/veille";
import { questions } from "@/data/questions";
import { glossaireTermes } from "@/data/glossaire";
import { themes } from "@/data/themes";
import type { QuestionItem, VeilleItem } from "@/types";

export function getCategorieBySlug(slug: string) {
  return categories.find((categorie) => categorie.slug === slug);
}

export function getVeilleBySlug(slug: string) {
  return veilleItems.find((item) => item.slug === slug);
}

export function getVeilleALaUne() {
  return veilleItems.filter((item) => item.aLaUne);
}

export function getVeilleParCategorie(categorieSlug: string) {
  return veilleItems.filter((item) => item.categorie === categorieSlug);
}

export function getQuestionsParCategorie(categorieSlug: string) {
  return questions.filter((item) => item.categorie === categorieSlug);
}

export function getQuestionBySlug(slug: string) {
  return questions.find((item) => item.slug === slug);
}

/**
 * Fiches similaires à une question donnée, pour la section « Questions
 * associées » d'une fiche. Priorité à la même catégorie fine, puis au même
 * domaine, puis complété par le reste du corpus pour toujours retourner
 * `count` résultats si le contenu disponible le permet.
 */
export function getRelatedQuestions(
  question: QuestionItem,
  count = 4,
): QuestionItem[] {
  const seen = new Set([question.slug]);
  const result: QuestionItem[] = [];

  const pools = [
    questions.filter((item) => item.categorie === question.categorie),
    questions.filter((item) => item.domaine === question.domaine),
    questions,
  ];

  for (const pool of pools) {
    for (const item of pool) {
      if (result.length >= count) break;
      if (seen.has(item.slug)) continue;
      seen.add(item.slug);
      result.push(item);
    }
  }

  return result;
}

/**
 * Analyses similaires à une analyse donnée, pour la section « Analyses
 * similaires ». Priorité à la même catégorie fine, puis au même domaine,
 * puis complété par le reste du corpus pour toujours retourner `count`
 * résultats si le contenu disponible le permet.
 */
export function getRelatedVeille(item: VeilleItem, count = 4): VeilleItem[] {
  const seen = new Set([item.slug]);
  const result: VeilleItem[] = [];

  const pools = [
    veilleItems.filter((candidate) => candidate.categorie === item.categorie),
    veilleItems.filter((candidate) => candidate.domaine === item.domaine),
    veilleItems,
  ];

  for (const pool of pools) {
    for (const candidate of pool) {
      if (result.length >= count) break;
      if (seen.has(candidate.slug)) continue;
      seen.add(candidate.slug);
      result.push(candidate);
    }
  }

  return result;
}

export function getThemeBySlug(slug: string) {
  return themes.find((theme) => theme.slug === slug);
}

/** Thème parent d'une `categorie` fine (voir `QuestionItem.categorie`). */
export function getThemeForCategorie(categorieSlug: string) {
  return themes.find((theme) =>
    theme.categoriesAssociees.includes(categorieSlug),
  );
}

/**
 * Fiches rattachées à un thème via `categoriesAssociees`. Un thème sans
 * catégorie associée retourne un tableau vide (voir `EmptyState` sur la
 * page Comprendre).
 */
export function getQuestionsParTheme(themeSlug: string) {
  const theme = getThemeBySlug(themeSlug);
  if (!theme) return [];

  return questions.filter((item) =>
    theme.categoriesAssociees.includes(item.categorie),
  );
}

export function getGlossaireGroupeParLettre() {
  const groupes = new Map<string, typeof glossaireTermes>();

  for (const terme of [...glossaireTermes].sort((a, b) =>
    a.terme.localeCompare(b.terme, "fr"),
  )) {
    const groupe = groupes.get(terme.lettre) ?? [];
    groupe.push(terme);
    groupes.set(terme.lettre, groupe);
  }

  return Array.from(groupes.entries()).sort(([a], [b]) => a.localeCompare(b));
}
