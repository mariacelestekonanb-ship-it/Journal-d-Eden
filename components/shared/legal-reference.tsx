import { ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { ReferenceJuridique } from "@/types";

export interface LegalReferenceProps {
  reference: ReferenceJuridique;
}

/**
 * Carte de citation d'une source juridique (traité, loi, règlement,
 * convention, directive, décision, jurisprudence ou site officiel).
 * Réutilisée par « Ce que dit le droit » et « Références » (fiche
 * pédagogique) ainsi que par « Le contexte juridique » (analyse de veille) :
 * seul le regroupement autour d'elle change d'une section à l'autre.
 */
export function LegalReference({ reference }: LegalReferenceProps) {
  return (
    <div className="border-border bg-card flex flex-col gap-3 rounded-xl border p-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <div className="min-w-0">
        <Badge variant="outline">{reference.type}</Badge>
        <p className="font-heading text-foreground mt-2 text-sm font-semibold">
          {reference.titre}
        </p>
        <p className="text-muted-foreground mt-1 text-sm">
          {reference.citation} — {reference.organisme}
        </p>
      </div>
      {reference.url ? (
        <a
          href={reference.url}
          target="_blank"
          rel="noreferrer noopener"
          className="text-navy-900 hover:text-gold-600 focus-visible:ring-ring inline-flex shrink-0 items-center gap-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          Consulter
          <ExternalLink className="size-3.5" aria-hidden />
        </a>
      ) : null}
    </div>
  );
}
