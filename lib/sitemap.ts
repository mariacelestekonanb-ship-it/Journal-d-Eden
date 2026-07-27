import { questions } from "@/data/questions";
import { veilleItems } from "@/data/veille";
import { siteConfig } from "@/lib/site-config";

export type ChangeFrequency =
  "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

export interface SitemapEntry {
  path: string;
  lastModified: Date;
  changeFrequency: ChangeFrequency;
  priority: number;
}

export function toAbsoluteUrl(path: string): string {
  return `${siteConfig.url}${path}`;
}

/**
 * Pages institutionnelles : racine du site et pages simples sans contenu
 * daté (pas de `lastModified` réel disponible, la date du jour sert de
 * valeur par défaut raisonnable). Les pages `noIndex` (mentions légales,
 * confidentialité) sont volontairement exclues : les lister ici entrerait
 * en contradiction avec leur balise `robots` et Search Console le signale
 * comme telle.
 */
export function institutionnelEntries(): SitemapEntry[] {
  const today = new Date();

  return [
    { path: "/", lastModified: today, changeFrequency: "weekly", priority: 1 },
    {
      path: "/a-propos",
      lastModified: today,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      path: "/contact",
      lastModified: today,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];
}

/** Bibliothèque Comprendre : la page d'index et chaque fiche pédagogique, datée par sa propre `dateMiseAJour`. */
export function comprendreEntries(): SitemapEntry[] {
  return [
    {
      path: "/comprendre",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...questions.map((question): SitemapEntry => ({
      path: `/comprendre/${question.slug}`,
      lastModified: new Date(question.dateMiseAJour),
      changeFrequency: "monthly",
      priority: 0.7,
    })),
  ];
}

/** Veille juridique : la page d'index et chaque analyse, datée par sa propre `dateMiseAJour`. */
export function veilleEntries(): SitemapEntry[] {
  return [
    {
      path: "/veille-juridique",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...veilleItems.map((item): SitemapEntry => ({
      path: `/veille-juridique/${item.slug}`,
      lastModified: new Date(item.dateMiseAJour),
      changeFrequency: "monthly",
      priority: 0.75,
    })),
  ];
}

/**
 * Glossaire : seule la page d'index est référencée — chaque terme vit en
 * ancre sur cette même page (voir `DefinitionPreview`), pas sur une URL
 * distincte à lister séparément.
 */
export function glossaireEntries(): SitemapEntry[] {
  return [
    {
      path: "/glossaire",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}

/**
 * Ressources : seule la page d'index est référencée — chaque ressource
 * pointe vers une URL externe, jamais listée dans le sitemap de LexWatch.
 */
export function ressourcesEntries(): SitemapEntry[] {
  return [
    {
      path: "/ressources",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}

/** Ensemble complet, toutes catégories confondues — utilisé par `app/sitemap.ts` (le plan de site plat). */
export function allEntries(): SitemapEntry[] {
  return [
    ...institutionnelEntries(),
    ...comprendreEntries(),
    ...veilleEntries(),
    ...glossaireEntries(),
    ...ressourcesEntries(),
  ];
}

/**
 * Sérialise une liste d'entrées en XML `<urlset>` brut — utilisé par les
 * sitemaps par type (`app/sitemap/*.xml/route.ts`), puisque la convention
 * `sitemap.ts` de Next.js ne peut produire qu'un seul document à la fois
 * (voir `app/sitemap-index.xml/route.ts` pour l'index qui les réunit).
 */
export function serializeUrlset(entries: SitemapEntry[]): string {
  const items = entries
    .map(
      (entry) => `
  <url>
    <loc>${toAbsoluteUrl(entry.path)}</loc>
    <lastmod>${entry.lastModified.toISOString()}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>
  </url>`,
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}\n</urlset>`;
}
