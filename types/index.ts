/**
 * Types de contenu partagés par l'ensemble de la plateforme LexWatch.
 */

export type Domaine = "droit-spatial" | "droit-numerique";

export type FiltreDomaine = "tous" | Domaine;

export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

export interface Categorie {
  slug: string;
  titre: string;
  description: string;
  domaine: Domaine;
  icone: string;
  nombreArticles: number;
}

export interface VeilleItem {
  slug: string;
  titre: string;
  resume: string;
  contenu: string[];
  pointsCles: string[];
  domaine: Domaine;
  categorie: string;
  date: string;
  source: string;
  tempsLecture: number;
  aLaUne?: boolean;
}

export type Niveau = "Débutant" | "Intermédiaire" | "Avancé";

export interface QuestionItem {
  slug: string;
  question: string;
  reponseCourte: string;
  reponseDetaillee: string[];
  domaine: Domaine;
  categorie: string;
  niveau: Niveau;
  tempsLecture: number;
  dateMiseAJour: string;
}

/**
 * Grand thème de navigation (distinct de `Categorie`, plus fin) utilisé par
 * la page Comprendre pour regrouper les fiches par domaine d'étude.
 */
export interface Theme {
  slug: string;
  titre: string;
  description: string;
  icone: string;
  /** Nombre de fiches affiché sur la carte — volontairement indicatif tant que le contenu réel n'est pas connecté. */
  nombreFichesApprox: number;
  /** Slugs de `categorie` (voir `QuestionItem`) rattachés à ce thème. */
  categoriesAssociees: string[];
}

export interface GlossaireTerme {
  terme: string;
  definition: string;
  domaine: Domaine;
  lettre: string;
  voirAussi?: string[];
}

export interface Ressource {
  titre: string;
  description: string;
  type: "Texte officiel" | "Rapport" | "Guide" | "Publication";
  domaine: Domaine;
  url: string;
  organisme: string;
}
