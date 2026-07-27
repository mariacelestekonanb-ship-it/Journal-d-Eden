import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site-config";

/**
 * Web App Manifest — prêt pour une future PWA installable, sans en être
 * une aujourd'hui (aucun service worker, aucun mode hors-ligne). Les
 * icônes générées dynamiquement (`/icon`, `/apple-icon`) suffisent pour le
 * favicon et l'écran d'accueil iOS ; il manque les tailles standard
 * 192×192 et 512×512 (dont une variante `maskable`) pour que Chrome/Android
 * proposent l'installation — à déposer dans `public/icons/` (déjà réservé,
 * voir son `.gitkeep`) le jour où cette PWA sera activée.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: `${siteConfig.name} — ${siteConfig.tagline}`,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#ffffff",
    theme_color: "#050b18",
    lang: "fr",
    categories: ["news", "education", "reference"],
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
