import type {
  Categorie,
  ContentBlock,
  GlossaireTerme,
  QuestionItem,
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
/** Image de couverture d'un contenu — voir `components/admin/content/cover-image-field.tsx`. */
export interface Couverture {
  url: string;
  alt: string;
  legende?: string;
}

/**
 * Surcouches SEO optionnelles, saisies depuis l'éditeur (voir
 * `components/admin/content/seo-panel.tsx`). Volontairement séparées des
 * champs publics (`question`, `titre`…) : un titre ou une description SEO
 * n'a de sens que comme *dérogation* à ce que `buildMetadata` calculerait
 * par défaut, jamais comme source de vérité du contenu lui-même.
 */
export interface SeoMeta {
  title?: string;
  description?: string;
  canonical?: string;
  ogImageUrl?: string;
}

export interface AdminMeta {
  id: string;
  status: AdminStatus;
  updatedAt: string;
  updatedBy: string;
  versions: Revision[];
  couverture?: Couverture;
  seo?: SeoMeta;
}

export interface FicheAdmin extends QuestionItem, AdminMeta {}
export interface AnalyseAdmin extends VeilleItem, AdminMeta {}
export interface GlossaireTermeAdmin extends GlossaireTerme, AdminMeta {}
export interface RessourceAdmin extends Ressource, AdminMeta {}
export interface CategorieAdmin extends Categorie, AdminMeta {}

export type AdminEntityType =
  "fiche" | "analyse" | "glossaire" | "ressource" | "categorie" | "parametres";

/**
 * Sous-ensemble d'`AdminEntityType` géré par un dépôt en liste (voir
 * `lib/admin/actions.ts` — statut, duplication, suppression). Exclut
 * `"parametres"`, un objet unique sans identifiant ni statut éditorial,
 * jamais manipulé via ces actions génériques.
 */
export type ListEntityType = Exclude<AdminEntityType, "parametres">;

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
 * Bloc de contenu de l'éditeur admin — simple alias de `ContentBlock`
 * (voir `types/index.ts`). Les deux ont fusionné : chaque bloc que
 * l'éditeur riche sait créer (titre, sous-titre, paragraphe, citation,
 * liste, tableau, encadrés, référence juridique, image, séparateur,
 * bouton) est désormais un bloc que le site public sait aussi afficher
 * (voir `ContentBlocks`) — brouillon et contenu publié partagent donc
 * toujours exactement la même forme sérialisable.
 */
export type AdminBlock = ContentBlock;

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

/**
 * Palette de couleurs du site — un jeu fermé de thèmes prêts à l'emploi
 * plutôt qu'un sélecteur de couleur libre, pour garantir que chaque
 * combinaison reste conforme au contraste WCAG AA déjà audité (voir
 * `styles/globals.css`). Chaque valeur correspond à un jeu de surcharges
 * des mêmes variables CSS (`--navy-*`, `--gold-*`, `--accent`), appliqué
 * via `lib/color-palettes.ts` — aucun composant n'a besoin de connaître la
 * palette active, ils continuent d'utiliser les mêmes classes Tailwind.
 */
export type ColorPalette =
  "navy-or" | "navy-emeraude" | "ardoise-bordeaux" | "nuit-cuivre";

export const COLOR_PALETTES: ColorPalette[] = [
  "navy-or",
  "navy-emeraude",
  "ardoise-bordeaux",
  "nuit-cuivre",
];

/**
 * Libellés seulement — les destinations des deux boutons (`/comprendre`,
 * `/veille-juridique`) restent fixes : ce sont les deux sections
 * structurantes du site, pas des liens éditoriaux (voir
 * `components/home/primary-actions.tsx`).
 *
 * `backgroundImageUrl` remplace le fond bleu nuit uni de l'en-tête par
 * l'image déposée via l'upload (voir `app/api/upload/route.ts`) ; absent,
 * le fond uni actuel reste inchangé. Même principe pour les en-têtes des
 * autres pages, voir `PageHeroBackgrounds`.
 */
export interface SiteSettingsHero {
  headline: string;
  description: string;
  ctaPrimaryLabel: string;
  ctaSecondaireLabel: string;
  backgroundImageUrl?: string;
}

/**
 * Images de fond des en-têtes des pages autres que l'accueil (qui a les
 * siennes dans `SiteSettingsHero`) — une par page, indépendantes les unes
 * des autres. Absente pour une page, l'en-tête garde son fond bleu nuit uni
 * actuel.
 */
export interface PageHeroBackgrounds {
  comprendre?: string;
  veilleJuridique?: string;
  glossaire?: string;
  aPropos?: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface SiteSettingsContact {
  email: string;
  liensSociaux: SocialLink[];
}

export interface SiteSettingsBranding {
  /** Image de logo réellement uploadée — si absente, le logo actuel (icône + nom) reste inchangé. */
  logoUrl?: string;
  palette: ColorPalette;
}

/**
 * Contenu des pages légales, en blocs riches (voir `AdminBlock` /
 * `ContentBlocks`) — le même éditeur et le même rendu que les fiches et
 * analyses, pas un système séparé pour ces deux pages.
 */
export interface SiteSettingsLegal {
  mentionsLegales: AdminBlock[];
  confidentialite: AdminBlock[];
}

/**
 * Réglages globaux du site — un objet unique, pas une liste (voir
 * `createSingletonStore` dans `lib/admin/repository.ts`), édité depuis
 * `/admin/reglages` et lu par les pages publiques concernées (Logo,
 * Hero, Footer, Contact, pages légales) pour que la rédactrice garde la
 * main sur l'identité et le contenu institutionnel du site sans dépendre
 * d'une intervention dans le code.
 */
export interface SiteSettings {
  branding: SiteSettingsBranding;
  hero: SiteSettingsHero;
  heroBackgrounds: PageHeroBackgrounds;
  contact: SiteSettingsContact;
  legal: SiteSettingsLegal;
  updatedAt: string;
  updatedBy: string;
}
