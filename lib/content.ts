import { categories } from "@/data/categories";
import { veilleItems } from "@/data/veille";
import { questions } from "@/data/questions";
import { glossaireTermes } from "@/data/glossaire";
import { themes } from "@/data/themes";

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

export function getThemeBySlug(slug: string) {
  return themes.find((theme) => theme.slug === slug);
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
