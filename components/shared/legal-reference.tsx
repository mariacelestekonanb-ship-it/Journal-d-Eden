import {
  ExternalLink,
  Globe2,
  Scale,
  FileText,
  Compass,
  Handshake,
  Gavel,
  Landmark,
  type LucideIcon,
} from "lucide-react";

import { Badge, type BadgeProps } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import type { ReferenceJuridique, TypeReference } from "@/types";

const TYPE_STYLE: Record<
  TypeReference,
  { icon: LucideIcon; variant: NonNullable<BadgeProps["variant"]> }
> = {
  Traité: { icon: Globe2, variant: "navy" },
  Loi: { icon: Scale, variant: "navy" },
  Règlement: { icon: FileText, variant: "navy" },
  Directive: { icon: Compass, variant: "navy" },
  Convention: { icon: Handshake, variant: "navy" },
  Décision: { icon: Gavel, variant: "accent" },
  Jurisprudence: { icon: Landmark, variant: "accent" },
  "Site officiel": { icon: ExternalLink, variant: "outline" },
};

export interface LegalReferenceProps {
  reference: ReferenceJuridique;
}

/**
 * Carte de citation d'une source juridique. Chaque type de référence a sa
 * propre icône et sa propre teinte de badge — textes normatifs (traité,
 * loi, règlement, directive, convention) en bleu nuit, jurisprudence en
 * doré, sites officiels neutres — pour qu'un lecteur distingue en un coup
 * d'œil la nature d'une source, sans avoir à lire le libellé. Réutilisée
 * par « Ce que dit le droit » et « Références » (fiche pédagogique), « Le
 * contexte juridique » (analyse de veille) et le bloc « Référence
 * juridique » de l'éditeur riche.
 */
export function LegalReference({ reference }: LegalReferenceProps) {
  const { icon: Icon, variant } = TYPE_STYLE[reference.type];

  return (
    <div className="border-border bg-card flex flex-col gap-3 rounded-xl border p-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <div className="min-w-0">
        <Badge variant={variant}>
          <Icon className="size-3.5" aria-hidden />
          {reference.type}
        </Badge>
        <p className="font-heading text-foreground mt-2 text-sm font-semibold">
          {reference.titre}
        </p>
        <p className="text-muted-foreground mt-1 text-sm">
          {reference.citation} — {reference.organisme}
          {reference.date ? ` · ${formatDate(reference.date)}` : ""}
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
