import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site-config";

/**
 * Les deux formes de sitemap sont annoncées : le plan de site plat
 * (`/sitemap.xml`, à jour de tout le contenu aujourd'hui) et l'index par
 * type (`/sitemap-index.xml`, l'architecture prête à absorber la
 * croissance du corpus — voir `lib/sitemap.ts`). Les robots qui suivent le
 * protocole Sitemaps acceptent plusieurs déclarations sans ambiguïté.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: [
      `${siteConfig.url}/sitemap.xml`,
      `${siteConfig.url}/sitemap-index.xml`,
    ],
  };
}
