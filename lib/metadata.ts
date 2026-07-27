import type { Metadata } from "next";

import { siteConfig } from "@/lib/site-config";
import { labelDomaine } from "@/lib/format";
import { getThemeBySlug } from "@/lib/content";
import type {
  GlossaireTerme,
  QuestionItem,
  Ressource,
  VeilleItem,
} from "@/types";

export interface ArticleMetadataInput {
  /** Absente pour un contenu qui n'a qu'une date de mise à jour (ex. une fiche pédagogique). */
  publishedTime?: string;
  modifiedTime: string;
  section: string;
}

export interface BuildMetadataInput {
  title: string;
  description: string;
  /** Chemin relatif au site (ex. `/comprendre/qui-possede-l-espace`) — résolu en URL absolue via `metadataBase` (voir `RootLayout`). */
  path: string;
  /** Mots-clés spécifiques à la page ; à défaut, hérite de `siteConfig.keywords` par simple absence de champ (fusion Next.js avec le layout parent). */
  keywords?: string[];
  /** Exclut la page de l'index des moteurs de recherche (mentions légales, confidentialité…) sans bloquer le suivi des liens. */
  noIndex?: boolean;
  /** Présent uniquement pour un contenu éditorial daté (fiche, analyse) : bascule `openGraph.type` sur `article` et ajoute les dates. */
  article?: ArticleMetadataInput;
}

/**
 * Générateur central de métadonnées de page — le point d'entrée unique que
 * chaque route doit utiliser plutôt que de construire son propre objet
 * `Metadata` à la main. Les constantes vraiment globales (auteur, éditeur,
 * jetons de vérification, mots-clés par défaut) vivent uniquement dans
 * `RootLayout` : l'API Metadata de Next.js les fusionne automatiquement à
 * ce que chaque page retourne ici, donc elles ne sont jamais dupliquées.
 */
export function buildMetadata({
  title,
  description,
  path,
  keywords,
  noIndex = false,
  article,
}: BuildMetadataInput): Metadata {
  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical: path },
    robots: noIndex
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      type: article ? "article" : "website",
      url: path,
      title,
      description,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      ...(article
        ? {
            ...(article.publishedTime
              ? { publishedTime: article.publishedTime }
              : {}),
            modifiedTime: article.modifiedTime,
            authors: [siteConfig.name],
            section: article.section,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: siteConfig.twitterHandle,
    },
  };
}

/** Métadonnées d'une fiche pédagogique — utilisée par `app/comprendre/[slug]/page.tsx`. */
export function buildFicheMetadata(question: QuestionItem): Metadata {
  return buildMetadata({
    title: question.question,
    description: question.reponseCourte,
    path: `/comprendre/${question.slug}`,
    keywords: [question.question, labelDomaine(question.domaine)],
    article: {
      modifiedTime: question.dateMiseAJour,
      section: labelDomaine(question.domaine),
    },
  });
}

/** Métadonnées d'une analyse de veille — utilisée par `app/veille-juridique/[slug]/page.tsx`. */
export function buildAnalyseMetadata(item: VeilleItem): Metadata {
  return buildMetadata({
    title: item.titre,
    description: item.resume,
    path: `/veille-juridique/${item.slug}`,
    keywords: [item.titre, item.source],
    article: {
      publishedTime: item.date,
      modifiedTime: item.dateMiseAJour,
      section: labelDomaine(item.domaine),
    },
  });
}

/**
 * Métadonnées d'un terme du glossaire. Le glossaire n'a pas de route dédiée
 * par terme aujourd'hui (chaque terme vit en ancre sur `/glossaire`, voir
 * `DefinitionPreview`) : cette fonction n'est donc appelée nulle part pour
 * l'instant. Elle est prête à être branchée sur un `generateMetadata` le
 * jour où une page `/glossaire/[terme]` existera — il suffira de lui passer
 * ce chemin réel en second paramètre.
 */
export function buildGlossaireTermeMetadata(
  terme: GlossaireTerme,
  path: string,
): Metadata {
  const themeLabel = getThemeBySlug(terme.theme)?.titre ?? terme.theme;

  return buildMetadata({
    title: `${terme.terme} — Glossaire`,
    description: terme.definition,
    path,
    keywords: [terme.terme, themeLabel],
  });
}

/**
 * Métadonnées d'une ressource. Comme pour le glossaire, aucune route de
 * détail par ressource n'existe aujourd'hui (chaque ressource pointe vers
 * un lien externe) : prête à être branchée si une page `/ressources/[slug]`
 * voit le jour.
 */
export function buildRessourceMetadata(
  ressource: Ressource,
  path: string,
): Metadata {
  return buildMetadata({
    title: ressource.titre,
    description: ressource.description,
    path,
    keywords: [ressource.titre, ressource.organisme, ressource.type],
  });
}
