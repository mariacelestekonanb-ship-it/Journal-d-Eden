import type { ColorPalette } from "@/lib/admin/types";

/**
 * Un thème = un jeu de surcharges des mêmes variables CSS que
 * `styles/globals.css` (`--navy-*`, `--gold-*`) — jamais de nouvelle
 * variable, jamais de classe Tailwind différente. Chaque teinte
 * accompagnatrice de `gold-700` (le texte des badges "accent", voir
 * `components/ui/badge.tsx`) a été choisie pour conserver un contraste
 * d'au moins 6:1 sur fond clair, comme l'original — changer de palette ne
 * doit jamais réintroduire le problème de contraste déjà corrigé.
 */
export const PALETTE_LABELS: Record<ColorPalette, string> = {
  "navy-or": "Bleu nuit & Or (par défaut)",
  "navy-emeraude": "Bleu nuit & Émeraude",
  "ardoise-bordeaux": "Ardoise & Bordeaux",
  "nuit-cuivre": "Nuit indigo & Cuivre",
};

/** Deux couleurs représentatives par palette, pour l'affichage d'un aperçu dans le sélecteur. */
export const PALETTE_SWATCHES: Record<ColorPalette, [string, string]> = {
  "navy-or": ["#0a1428", "#c9a227"],
  "navy-emeraude": ["#0a1428", "#2f9d68"],
  "ardoise-bordeaux": ["#1a1d24", "#b8324a"],
  "nuit-cuivre": ["#171335", "#c97a3a"],
};

const PALETTE_VARIABLES: Record<ColorPalette, Record<string, string>> = {
  "navy-or": {
    "--navy-950": "#050b18",
    "--navy-900": "#0a1428",
    "--navy-800": "#0f1d3a",
    "--navy-700": "#16294d",
    "--navy-600": "#1f3763",
    "--navy-500": "#2c4a80",
    "--gold-700": "#7a5a17",
    "--gold-600": "#a3781f",
    "--gold-500": "#c9a227",
    "--gold-400": "#d9b94a",
    "--gold-300": "#e6cd7c",
    "--gold-100": "#f5ead0",
  },
  "navy-emeraude": {
    "--navy-950": "#050b18",
    "--navy-900": "#0a1428",
    "--navy-800": "#0f1d3a",
    "--navy-700": "#16294d",
    "--navy-600": "#1f3763",
    "--navy-500": "#2c4a80",
    "--gold-700": "#1f6f4a",
    "--gold-600": "#227a52",
    "--gold-500": "#2f9d68",
    "--gold-400": "#55b98a",
    "--gold-300": "#8fd4b2",
    "--gold-100": "#dcf5e8",
  },
  "ardoise-bordeaux": {
    "--navy-950": "#0f1115",
    "--navy-900": "#1a1d24",
    "--navy-800": "#23272f",
    "--navy-700": "#2e3440",
    "--navy-600": "#3d4552",
    "--navy-500": "#4f5a6b",
    "--gold-700": "#7a1f2f",
    "--gold-600": "#9c2a3d",
    "--gold-500": "#b8324a",
    "--gold-400": "#cc5a70",
    "--gold-300": "#dd8a99",
    "--gold-100": "#f5dde1",
  },
  "nuit-cuivre": {
    "--navy-950": "#0c0a1f",
    "--navy-900": "#171335",
    "--navy-800": "#221c4d",
    "--navy-700": "#2d2566",
    "--navy-600": "#3d3285",
    "--navy-500": "#5142a8",
    "--gold-700": "#8a4a1f",
    "--gold-600": "#a85f28",
    "--gold-500": "#c97a3a",
    "--gold-400": "#dc9860",
    "--gold-300": "#e8b98d",
    "--gold-100": "#f7e3d0",
  },
};

/**
 * Feuille de style à injecter dans `app/layout.tsx` — surcharge `:root`
 * après l'import de `styles/globals.css`, donc l'emporte pour les
 * variables qu'elle définit sans toucher au reste du thème (rayons,
 * gris, sémantique clair/sombre).
 */
export function buildPaletteStyle(palette: ColorPalette): string {
  const variables = PALETTE_VARIABLES[palette];
  const declarations = Object.entries(variables)
    .map(([name, value]) => `${name}: ${value};`)
    .join(" ");
  return `:root { ${declarations} }`;
}
