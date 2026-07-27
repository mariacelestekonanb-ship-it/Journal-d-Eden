import type { MetadataRoute } from "next";

import { allEntries, toAbsoluteUrl } from "@/lib/sitemap";

/**
 * Plan de site plat, à jour de tout le contenu (pages institutionnelles,
 * fiches, analyses, index Glossaire et Ressources) — le document de
 * référence tant que le corpus reste de cette taille. Voir aussi
 * `/sitemap-index.xml` et `/sitemap/*.xml`, l'architecture par type prête
 * à prendre le relais si le corpus grossit significativement (voir le
 * livrable de fin de phase).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return allEntries().map((entry) => ({
    url: toAbsoluteUrl(entry.path),
    lastModified: entry.lastModified,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
