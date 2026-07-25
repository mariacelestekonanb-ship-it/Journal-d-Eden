import type { Domaine } from "@/types";

const domaineLabels: Record<Domaine, string> = {
  "droit-spatial": "Droit spatial",
  "droit-numerique": "Droit du numérique",
};

export function labelDomaine(domaine: Domaine): string {
  return domaineLabels[domaine];
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}
