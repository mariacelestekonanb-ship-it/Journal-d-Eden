import type { NextConfig } from "next";

/**
 * Content-Security-Policy volontairement sans nonce (pas de middleware dans
 * ce dépôt) : `'unsafe-inline'` reste nécessaire pour les extraits inline
 * des scripts analytics conditionnels (voir
 * `components/analytics/analytics-scripts.tsx`) et pour les quelques
 * `style={{...}}` dynamiques (barre de progression de lecture,
 * illustrations). C'est une base de référence raisonnable, pas une CSP
 * maximaliste — passer à une CSP par nonce (middleware générant un nonce
 * par requête) est documenté comme piste V2 dans `SECURITY.md`. Chaque
 * hôte autorisé correspond à une intégration analytics optionnelle réelle
 * de `lib/analytics-config.ts` ; aucune image ni police externe n'est
 * chargée par le site (tous les médias sont servis depuis `/media`, les
 * polices sont auto-hébergées via `next/font`).
 */
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.clarity.ms https://plausible.io",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://www.clarity.ms https://plausible.io",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  // Explicite plutôt qu'implicite : la compression gzip/brotli est déjà le
  // comportement par défaut de Next.js en production, mais l'exprimer ici
  // documente l'intention plutôt que de compter sur une valeur par défaut
  // silencieuse.
  compress: true,
  // Retire l'en-tête `X-Powered-By: Next.js`, qui ne sert qu'à révéler la
  // stack technique sans apporter de valeur au visiteur ni au référencement.
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
    ];
  },
};

export default nextConfig;
