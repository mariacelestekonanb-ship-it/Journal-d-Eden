import type { NavItem } from "@/types";

export const siteConfig = {
  name: "LexWatch",
  tagline: "La veille juridique du droit spatial et du numérique",
  description:
    "LexWatch décrypte le droit spatial et le droit du numérique pour les professionnels, chercheurs et curieux : veille juridique, glossaire, ressources et analyses claires.",
  url: "https://lexwatch.example.com",
  email: "contact@lexwatch.io",
  /** Compte X/Twitter de la plateforme — placeholder à remplacer avant mise en production. */
  twitterHandle: "@lexwatch",
  locale: "fr_FR",
  /** Mots-clés par défaut, hérités par toute page qui n'en fournit pas de plus spécifiques (voir `buildMetadata`). */
  keywords: [
    "droit spatial",
    "droit du numérique",
    "veille juridique",
    "espace",
    "réglementation spatiale",
    "cybersécurité juridique",
    "space law",
  ],
};

/**
 * Jetons de vérification des outils webmaster (Google Search Console,
 * Bing…). Lus depuis des variables d'environnement plutôt que codés en dur :
 * tant qu'elles ne sont pas définies, Next.js n'émet simplement aucune
 * balise `<meta name="…-site-verification">` (voir `RootLayout`). À
 * renseigner avant la mise en production réelle.
 */
export const searchConsoleVerification = {
  google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
    ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
    : undefined,
};

export const mainNav: NavItem[] = [
  { label: "Accueil", href: "/" },
  { label: "Comprendre", href: "/comprendre" },
  { label: "Veille juridique", href: "/veille-juridique" },
  { label: "Glossaire", href: "/glossaire" },
  { label: "Ressources", href: "/ressources" },
  { label: "À propos", href: "/a-propos" },
  { label: "Contact", href: "/contact" },
];

export const footerNav = {
  plateforme: [
    { label: "Accueil", href: "/" },
    { label: "Comprendre", href: "/comprendre" },
    { label: "Veille juridique", href: "/veille-juridique" },
  ],
  ressources: [
    { label: "Glossaire", href: "/glossaire" },
    { label: "Ressources", href: "/ressources" },
    { label: "À propos", href: "/a-propos" },
  ],
  contact: [
    { label: "Contact", href: "/contact" },
    { label: "Veille juridique", href: "/veille-juridique" },
    { label: "Glossaire", href: "/glossaire" },
  ],
};

export const legalNav: NavItem[] = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Confidentialité", href: "/confidentialite" },
];
