/**
 * Identifiants analytics lus depuis des variables d'environnement. Tous
 * `undefined` par défaut dans ce dépôt : aucune intégration réelle n'est
 * activée (voir `components/analytics/analytics-scripts.tsx`), seule
 * l'architecture d'accueil est prête. Google Search Console est couvert à
 * part, via `verification` dans `RootLayout` (voir `lib/site-config.ts`).
 */
export const analyticsConfig = {
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  clarityProjectId: process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID,
  plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
};
