import type {
  Categorie,
  ContentBlock,
  GlossaireTerme,
  QuestionItem,
  ReferenceJuridique,
  Ressource,
  VeilleItem,
} from "@/types";

/**
 * Statut éditorial d'un contenu — distinct de tout champ du modèle public
 * (`QuestionItem`, `VeilleItem`…), qui ignore volontairement la notion de
 * brouillon. C'est la couche que l'admin ajoute par-dessus le contenu
 * public, jamais l'inverse.
 */
export type AdminStatus =
  "brouillon" | "en-relecture" | "a-corriger" | "publie" | "archive";

export const ADMIN_STATUSES: AdminStatus[] = [
  "brouillon",
  "en-relecture",
  "a-corriger",
  "publie",
  "archive",
];

/** Une entrée d'historique — voir `components/admin/revisions/revision-history.tsx`. Aucun stockage réel : structure uniquement. */
export interface Revision {
  id: string;
  date: string;
  auteur: string;
  resume: string;
}

/**
 * Métadonnées éditoriales communes à tout contenu géré par l'admin. Les
 * types `*Admin` ci-dessous combinent cette interface avec le type public
 * correspondant (`extends`) plutôt que de l'imbriquer, pour que
 * `fiche.status` et `fiche.question` soient tout aussi directement
 * accessibles l'un que l'autre dans les tableaux et formulaires.
 */
export interface AdminMeta {
  id: string;
  status: AdminStatus;
  updatedAt: string;
  updatedBy: string;
  versions: Revision[];
}

export interface FicheAdmin extends QuestionItem, AdminMeta {}
export interface AnalyseAdmin extends VeilleItem, AdminMeta {}
export interface GlossaireTermeAdmin extends GlossaireTerme, AdminMeta {}
export interface RessourceAdmin extends Ressource, AdminMeta {}
export interface CategorieAdmin extends Categorie, AdminMeta {}

export type AdminEntityType =
  "fiche" | "analyse" | "glossaire" | "ressource" | "categorie";

/** N'importe quel contenu géré par l'admin, réduit à ce que les vues génériques (tableau, recherche) ont besoin de connaître. */
export type AnyAdminContent =
  | FicheAdmin
  | AnalyseAdmin
  | GlossaireTermeAdmin
  | RessourceAdmin
  | CategorieAdmin;

export interface ActivityLogEntry {
  id: string;
  date: string;
  auteur: string;
  action: string;
  entityType: AdminEntityType;
  titre: string;
  href: string;
}

/**
 * Bloc de contenu de l'éditeur admin. Réutilise directement `ContentBlock`
 * (paragraphe, titre, encadré, liste, citation) — le contenu public et le
 * contenu en édition partagent donc la même forme sérialisable — et
 * l'étend avec les types de blocs propres à l'éditeur riche : tableau,
 * code, image, référence juridique et lien.
 */
export type AdminBlock =
  | ContentBlock
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "code"; language: string; code: string }
  | { type: "image"; url: string; alt: string; caption?: string }
  | { type: "legal-reference"; reference: ReferenceJuridique }
  | { type: "link"; label: string; href: string };

export type MediaType = "image" | "logo" | "pdf" | "document" | "illustration";

export interface MediaAsset {
  id: string;
  nom: string;
  type: MediaType;
  url: string;
  tailleKo: number;
  ajouteLe: string;
  alt?: string;
}
