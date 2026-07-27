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

export type Niveau = "Débutant" | "Intermédiaire" | "Avancé";

/**
 * Bloc de contenu riche pour un corps de texte long (« Notre explication »
 * d'une fiche, « Notre analyse » d'une analyse de veille). Modèle par blocs
 * typés — volontairement proche de ce que renverrait un CMS headless (Sanity,
 * Contentful…), pour que brancher une vraie source de contenu plus tard
 * revienne à remplacer le tableau, pas le composant qui le rend (voir
 * `ContentBlocks`).
 */
export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "callout"; text: string; tone?: "info" | "warning" }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "quote"; text: string; source?: string };

export type TypeReference =
  | "Traité"
  | "Loi"
  | "Règlement"
  | "Convention"
  | "Directive"
  | "Décision"
  | "Jurisprudence"
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
 * la page Comprendre pour regrouper les fiches par domaine d'étude, et par
 * la Veille juridique pour son filtre « Domaine ».
 */
export interface Theme {
  slug: string;
  titre: string;
  description: string;
  icone: string;
  /** Nombre de fiches affiché sur la carte — volontairement indicatif tant que le contenu réel n'est pas connecté. */
  nombreFichesApprox: number;
  /** Slugs de `categorie` (voir `QuestionItem.categorie` et `VeilleItem.categorie`) rattachés à ce thème. */
  categoriesAssociees: string[];
}

/**
 * Nature de la publication de veille — distincte de `TypeReference` (les
 * sources citées à l'intérieur d'une analyse) : ici, c'est la publication
 * elle-même qui est classée.
 */
export type TypeVeille =
  | "Décision"
  | "Loi"
  | "Règlement"
  | "Convention"
  | "Jurisprudence"
  | "Institution";

/** Événement daté de la section « Les faits » (composant `Timeline`). */
export interface EvenementChronologie {
  date: string;
  titre: string;
  description?: string;
}

/**
 * Conséquences d'une analyse, groupées par nature — section « Pourquoi cette
 * décision est importante ». `economique` reste optionnel : seules certaines
 * analyses ont un volet économique pertinent.
 */
export interface ImpactAnalyse {
  juridique?: string[];
  pratique?: string[];
  institutionnel?: string[];
  economique?: string[];
}

export type TypeReferenceOfficielle =
  "Texte officiel" | "Communiqué" | "Site officiel" | "Document PDF";

/**
 * Source officielle citée en fin d'analyse — section « Références
 * officielles ». Distinct de `ReferenceJuridique` : ce n'est pas
 * nécessairement un texte normatif (peut être un communiqué de presse, un
 * site institutionnel ou un document PDF).
 */
export interface ReferenceOfficielle {
  type: TypeReferenceOfficielle;
  titre: string;
  organisme: string;
  url: string;
}

export interface VeilleItem {
  slug: string;
  titre: string;
  resume: string;
  /** 3 à 5 points pour l'encadré « À retenir en 1 minute » (composant `AnalysisSummary`). */
  pointsCles: string[];
  domaine: Domaine;
  categorie: string;
  type: TypeVeille;
  /** Date de publication initiale de l'analyse. */
  date: string;
  /** Date de dernière mise à jour — distincte de `date` lorsque l'analyse a été révisée. */
  dateMiseAJour: string;
  /** Institution ou organisme source (ex. « Commission européenne », « CNIL »). */
  source: string;
  tempsLecture: number;
  aLaUne?: boolean;
  /** Chronologie des faits, dans l'ordre — section « Les faits » (composant `Timeline`). */
  chronologie: EvenementChronologie[];
  /** Textes applicables cités par l'analyse — section « Le contexte juridique » (composant `LegalContext`). */
  contexteJuridique: ReferenceJuridique[];
  /** Corps principal de l'analyse, par blocs typés — section « Notre analyse ». */
  analyse: ContentBlock[];
  /** Conséquences par catégorie — section « Pourquoi cette décision est importante » (composant `ImpactSection`). */
  impact: ImpactAnalyse;
  /** Sources officielles citées — section « Références officielles » (composant `OfficialReference`). */
  referencesOfficielles: ReferenceOfficielle[];
}

/**
 * Contenus réellement rattachés à un terme du glossaire — slugs vers
 * `data/questions.ts` (fiches) et `data/veille.ts` (analyses). Optionnel :
 * un terme peut n'avoir aucun contenu associé pour l'instant, auquel cas la
 * carte affiche « Aucun contenu associé » plutôt qu'un lien mort.
 */
export interface ContenusAssocies {
  fiches?: string[];
  analyses?: string[];
}

export interface GlossaireTerme {
  terme: string;
  definition: string;
  /** Slug de `Theme` (voir `data/themes.ts`) — sert de filtre « Catégorie » du glossaire. */
  theme: string;
  lettre: string;
  voirAussi?: string[];
  contenusAssocies?: ContenusAssocies;
}

export interface Ressource {
  titre: string;
  description: string;
  type: "Texte officiel" | "Rapport" | "Guide" | "Publication";
  domaine: Domaine;
  url: string;
  organisme: string;
}

/**
 * Institution de référence citée en source des contenus — page « À propos »
 * (composant `SourceCard`). Simple carte de présentation, sans lien avec le
 * modèle de `ReferenceJuridique` (qui cite un texte précis, pas
 * l'organisme qui l'a produit).
 */
export interface Institution {
  nom: string;
  /** Sigle affiché en évidence sur la carte (ex. « ONU », « CNIL »). */
  sigle: string;
  description: string;
  url: string;
}
