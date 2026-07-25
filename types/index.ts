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

export interface QuestionItem {
  slug: string;
  question: string;
  reponseCourte: string;
  reponseDetaillee: string[];
  domaine: Domaine;
  categorie: string;
  niveau: "Débutant" | "Intermédiaire" | "Avancé";
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
