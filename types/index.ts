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

/**
 * Nature de la publication de veille — distincte de `TypeReference` (les
 * sources citées à l'intérieur d'une fiche) : ici, c'est la publication
 * elle-même qui est classée.
 */
export type TypeVeille =
  | "Décision"
  | "Loi"
  | "Règlement"
  | "Convention"
  | "Jurisprudence"
  | "Institution";

export interface VeilleItem {
  slug: string;
  titre: string;
  resume: string;
  contenu: string[];
  pointsCles: string[];
  domaine: Domaine;
  categorie: string;
  type: TypeVeille;
  date: string;
  /** Institution ou organisme source (ex. « Commission européenne », « CNIL »). */
  source: string;
  tempsLecture: number;
  aLaUne?: boolean;
}

export type Niveau = "Débutant" | "Intermédiaire" | "Avancé";

/**
 * Bloc de contenu riche pour la section « Notre explication » d'une fiche.
 * Modèle par blocs typés — volontairement proche de ce que renverrait un
 * CMS headless (Sanity, Contentful…), pour que brancher une vraie source de
 * contenu plus tard revienne à remplacer le tableau, pas le composant qui
 * le rend (voir `ExplicationBlocks`).
 */
export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "callout"; text: string; tone?: "info" | "warning" }
  | { type: "list"; items: string[]; ordered?: boolean };

export type TypeReference =
  | "Traité"
  | "Loi"
  | "Règlement"
  | "Convention"
  | "Directive"
  | "Décision"
  | "Site officiel";

export interface ReferenceJuridique {
  type: TypeReference;
  titre: string;
  /** Citation précise (article, numéro, année…), ex. « Article II, 1967 ». */
  citation: string;
  organisme: string;
  url?: string;
}

export interface QuestionItem {
  slug: string;
  question: string;
  reponseCourte: string;
  /** Paragraphes courts répondant à « Pourquoi cette question se pose ? ». */
  contexte: string[];
  /** Contenu principal de la fiche (« Notre explication »). */
  explication: ContentBlock[];
  /** 3 à 5 points pour la section « À retenir ». */
  pointsCles: string[];
  /** Sources citées : sert à la fois « Ce que dit le droit » (textes normatifs) et « Références » (bibliographie complète). */
  references: ReferenceJuridique[];
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
