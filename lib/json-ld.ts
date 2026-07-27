import { siteConfig } from "@/lib/site-config";

/** Référence intégrée à l'organisation éditrice, réutilisée dans plusieurs schémas (Article, LearningResource…). */
function organizationRef() {
  return {
    "@type": "Organization" as const,
    name: siteConfig.name,
    url: siteConfig.url,
  };
}

/** Référence intégrée au site, réutilisée comme `isPartOf` par les pages et contenus. */
function websiteRef() {
  return {
    "@type": "WebSite" as const,
    name: siteConfig.name,
    url: siteConfig.url,
  };
}

/**
 * `WebSite` + `SearchAction` : émis une seule fois, dans `RootLayout`, donc
 * présent sur chaque page. Le `SearchAction` cible `/comprendre?q=` — la
 * page qui se rapproche le plus d'un résultat de recherche indexable
 * aujourd'hui, la recherche globale (Ctrl/Cmd+K) étant côté client. Voir le
 * livrable de fin de phase pour la marche à suivre si une vraie page de
 * résultats voit le jour.
 */
export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    inLanguage: "fr",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/comprendre?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** `Organization` : émise une seule fois, dans `RootLayout`. */
export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    logo: `${siteConfig.url}/icon`,
  };
}

export interface BreadcrumbJsonLdItem {
  label: string;
  href?: string;
}

/**
 * `BreadcrumbList` — à construire à partir des mêmes `items` que le fil
 * d'Ariane visuel (voir `components/shared/breadcrumb.tsx`, qui appelle
 * cette fonction directement : aucun autre point d'appel ne doit dupliquer
 * cette liste à la main).
 */
export function buildBreadcrumbJsonLd(items: BreadcrumbJsonLdItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `${siteConfig.url}${item.href}` } : {}),
    })),
  };
}

export interface ArticleJsonLdInput {
  headline: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified: string;
  section: string;
}

/** `Article` — une analyse de veille juridique (`app/veille-juridique/[slug]`). */
export function buildArticleJsonLd(input: ArticleJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    inLanguage: "fr",
    articleSection: input.section,
    author: organizationRef(),
    publisher: organizationRef(),
    isPartOf: websiteRef(),
    url: `${siteConfig.url}${input.path}`,
  };
}

export interface LearningResourceJsonLdInput {
  name: string;
  description: string;
  path: string;
  educationalLevel: string;
  dateModified: string;
  about: string;
}

/** `LearningResource` — une fiche pédagogique (`app/comprendre/[slug]`). */
export function buildLearningResourceJsonLd(
  input: LearningResourceJsonLdInput,
) {
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    headline: input.name,
    name: input.name,
    description: input.description,
    learningResourceType: "Fiche pédagogique",
    educationalLevel: input.educationalLevel,
    dateModified: input.dateModified,
    inLanguage: "fr",
    about: input.about,
    isPartOf: websiteRef(),
    publisher: organizationRef(),
    url: `${siteConfig.url}${input.path}`,
  };
}

export interface DefinedTermInput {
  name: string;
  description: string;
  themeLabel: string;
}

/** `DefinedTermSet` — le Glossaire dans son ensemble, chaque terme devenant un `DefinedTerm` imbriqué. */
export function buildDefinedTermSetJsonLd(terms: DefinedTermInput[]) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: `Glossaire ${siteConfig.name}`,
    description:
      "Lexique des termes clés du droit spatial et du droit du numérique.",
    url: `${siteConfig.url}/glossaire`,
    hasDefinedTerm: terms.map((term) => ({
      "@type": "DefinedTerm",
      name: term.name,
      description: term.description,
      inDefinedTermSet: `${siteConfig.url}/glossaire`,
      termCode: term.themeLabel,
    })),
  };
}

export interface CollectionPageJsonLdInput {
  name: string;
  description: string;
  path: string;
}

/** `CollectionPage` — une page de liste (Comprendre, Veille juridique, Ressources). */
export function buildCollectionPageJsonLd(input: CollectionPageJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.name,
    description: input.description,
    url: `${siteConfig.url}${input.path}`,
    isPartOf: websiteRef(),
  };
}

export interface WebPageJsonLdInput {
  name: string;
  description: string;
  path: string;
}

/** `WebPage` générique — pages institutionnelles simples (À propos, Contact, mentions légales…). */
export function buildWebPageJsonLd(input: WebPageJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.name,
    description: input.description,
    url: `${siteConfig.url}${input.path}`,
    isPartOf: websiteRef(),
  };
}

export interface FaqItemInput {
  question: string;
  reponse: string;
}

/**
 * `FAQPage` — les questions de Comprendre forment naturellement des paires
 * question/réponse ; ce schéma peut faire gagner un encart FAQ enrichi dans
 * les résultats de recherche.
 */
export function buildFaqPageJsonLd(items: FaqItemInput[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.reponse,
      },
    })),
  };
}
