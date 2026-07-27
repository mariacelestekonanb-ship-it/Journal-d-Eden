import { NextResponse } from "next/server";

import { siteConfig } from "@/lib/site-config";

/**
 * Noms des sitemaps enfants, organisés par type — ajouter une nouvelle
 * catégorie de contenu revient à ajouter une entrée ici et un
 * `lib/sitemap.ts#xxxEntries()` + `app/sitemap/xxx.xml/route.ts` associés.
 */
const CHILD_SITEMAPS = [
  "institutionnel",
  "comprendre",
  "veille-juridique",
  "glossaire",
  "ressources",
];

/**
 * Véritable index de sitemaps (`<sitemapindex>`), au format standard du
 * protocole Sitemaps — la convention `sitemap.ts` de Next.js ne sait
 * produire qu'un `<urlset>` plat (voir `app/sitemap.ts`), jamais un
 * `<sitemapindex>` : ce fichier comble ce manque via un Route Handler brut.
 */
export function GET() {
  const items = CHILD_SITEMAPS.map(
    (name) => `
  <sitemap>
    <loc>${siteConfig.url}/sitemap/${name}.xml</loc>
  </sitemap>`,
  ).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}\n</sitemapindex>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
