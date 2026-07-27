import type { BadgeProps } from "@/components/ui/badge";
import type { Domaine, QuestionItem } from "@/types";

const domaineLabels: Record<Domaine, string> = {
  "droit-spatial": "Droit spatial",
  "droit-numerique": "Droit du numérique",
};

export function labelDomaine(domaine: Domaine): string {
  return domaineLabels[domaine];
}

const niveauBadgeVariants: Record<
  QuestionItem["niveau"],
  NonNullable<BadgeProps["variant"]>
> = {
  Débutant: "accent",
  Intermédiaire: "outline",
  Avancé: "navy",
};

/** Variante de `Badge` associée à un niveau de difficulté — une seule échelle de couleurs pour toutes les cartes de fiche. */
export function niveauBadgeVariant(
  niveau: QuestionItem["niveau"],
): NonNullable<BadgeProps["variant"]> {
  return niveauBadgeVariants[niveau];
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

/**
 * Identifiant d'ancre stable pour un terme du glossaire (ex. « DSA (Digital
 * Services Act) » → « dsa-digital-services-act »). Utilisé à la fois comme
 * `id` de carte et comme cible des suggestions de recherche, en l'absence
 * de page de détail dédiée pour chaque terme.
 */
export function slugifyTerme(terme: string): string {
  return terme
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
