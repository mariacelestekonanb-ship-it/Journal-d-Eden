import type { NavItem } from "@/types";

export const siteConfig = {
  name: "LexWatch",
  tagline: "La veille juridique du droit spatial et du numérique",
  description:
    "LexWatch décrypte le droit spatial et le droit du numérique pour les professionnels, chercheurs et curieux : veille juridique, glossaire, ressources et analyses claires.",
  url: "https://lexwatch.example.com",
  email: "contact@lexwatch.io",
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
