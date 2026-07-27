import { questions } from "@/data/questions";
import { veilleItems } from "@/data/veille";
import { glossaireTermes } from "@/data/glossaire";
import { ressources } from "@/data/ressources";
import { getThemeBySlug } from "@/lib/content";
import { slugifyTerme } from "@/lib/format";

/**
 * Clé technique de regroupement d'un résultat — distincte de `categorieLabel`
 * (le libellé affiché). Sert à répartir les résultats dans les sections
 * 📚 Comprendre / 📰 Veille juridique / 📖 Glossaire / 📂 Ressources.
 */
export type SearchResultType = "fiche" | "analyse" | "glossaire" | "ressource";

export interface SearchResultItem {
  id: string;
  type: SearchResultType;
  /** Libellé de section affiché (« Comprendre », « Veille juridique »…). */
  categorieLabel: string;
  /** Nature précise du contenu (ex. « Règlement », « Fiche pédagogique », « Guide ») — réutilise les champs déjà typés des données sources quand ils existent. */
  typeLabel: string;
  titre: string;
  resume: string;
  href: string;
  /** `true` pour un lien qui quitte LexWatch (ressources externes). */
  external?: boolean;
  /** Ligne secondaire discrète (temps de lecture, organisme, thème…). */
  meta?: string;
}

function indexFiches(): SearchResultItem[] {
  return questions.map((question) => ({
    id: `fiche-${question.slug}`,
    type: "fiche",
    categorieLabel: "Comprendre",
    typeLabel: "Fiche pédagogique",
    titre: question.question,
    resume: question.reponseCourte,
    href: `/comprendre/${question.slug}`,
    meta: `${question.tempsLecture} min de lecture`,
  }));
}

function indexAnalyses(): SearchResultItem[] {
  return veilleItems.map((item) => ({
    id: `analyse-${item.slug}`,
    type: "analyse",
    categorieLabel: "Veille juridique",
    typeLabel: item.type,
    titre: item.titre,
    resume: item.resume,
    href: `/veille-juridique/${item.slug}`,
    meta: item.source,
  }));
}

function indexGlossaire(): SearchResultItem[] {
  return glossaireTermes.map((terme) => ({
    id: `glossaire-${slugifyTerme(terme.terme)}`,
    type: "glossaire",
    categorieLabel: "Glossaire",
    typeLabel: "Définition",
    titre: terme.terme,
    resume: terme.definition,
    href: `/glossaire#${slugifyTerme(terme.terme)}`,
    meta: getThemeBySlug(terme.theme)?.titre,
  }));
}

function indexRessources(): SearchResultItem[] {
  return ressources.map((ressource, index) => ({
    id: `ressource-${index}`,
    type: "ressource",
    categorieLabel: "Ressources",
    typeLabel: ressource.type,
    titre: ressource.titre,
    resume: ressource.description,
    href: ressource.url,
    external: true,
    meta: ressource.organisme,
  }));
}

/**
 * Index de recherche en mémoire, construit une fois au chargement du module
 * à partir des mêmes tableaux que ceux qui alimentent Comprendre, Veille
 * juridique, le Glossaire et les Ressources — un seul contenu, jamais
 * dupliqué pour les besoins de la recherche.
 */
const SEARCH_INDEX: SearchResultItem[] = [
  ...indexFiches(),
  ...indexAnalyses(),
  ...indexGlossaire(),
  ...indexRessources(),
];

export interface SearchProvider {
  search(query: string): Promise<SearchResultItem[]> | SearchResultItem[];
}

/**
 * Implémentation par défaut : recherche texte simple en mémoire. C'est la
 * seule pièce de l'architecture qui dépend d'un moteur particulier — pour
 * brancher Algolia, Typesense, ElasticSearch ou PostgreSQL Full Text Search,
 * il suffit d'écrire un autre `SearchProvider` (typiquement un appel réseau
 * qui retourne la même forme `SearchResultItem[]`) et de remplacer
 * `searchProvider` ci-dessous : aucun composant de recherche n'a besoin de
 * changer.
 */
const localSearchProvider: SearchProvider = {
  search(query: string) {
    const normalized = query.trim().toLowerCase();
    if (normalized.length === 0) return [];

    return SEARCH_INDEX.filter((item) =>
      `${item.titre} ${item.resume} ${item.meta ?? ""}`
        .toLowerCase()
        .includes(normalized),
    );
  },
};

/** Point d'injection unique du moteur de recherche — voir `SearchProvider`. */
export const searchProvider: SearchProvider = localSearchProvider;

/**
 * Suggestions de démonstration pour « Recherches populaires » : termes
 * choisis pour renvoyer systématiquement de vrais résultats, plutôt que des
 * requêtes fictives qui mèneraient à un état « aucun résultat ».
 */
export const RECHERCHES_POPULAIRES = [
  "RGPD",
  "AI Act",
  "Débris orbital",
  "DMA",
  "Droit à l'oubli",
];
