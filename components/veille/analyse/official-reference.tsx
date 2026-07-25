import {
  FileText,
  Megaphone,
  Globe,
  FileDown,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";

import type { ReferenceOfficielle, TypeReferenceOfficielle } from "@/types";

export interface OfficialReferenceProps {
  reference: ReferenceOfficielle;
}

const ICONS: Record<TypeReferenceOfficielle, LucideIcon> = {
  "Texte officiel": FileText,
  Communiqué: Megaphone,
  "Site officiel": Globe,
  "Document PDF": FileDown,
};

/**
 * Carte d'une source officielle citée en fin d'analyse. Une icône dédiée par
 * type (texte officiel, communiqué, site officiel, document PDF) rend
 * chaque référence identifiable au premier coup d'œil.
 */
export function OfficialReference({ reference }: OfficialReferenceProps) {
  const Icon = ICONS[reference.type];

  return (
    <a
      href={reference.url}
      target="_blank"
      rel="noreferrer noopener"
      className="border-border bg-card hover:border-accent/40 focus-visible:ring-ring group flex items-start gap-4 rounded-xl border p-5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
    >
      <span
        aria-hidden
        className="bg-secondary text-navy-900 flex size-10 shrink-0 items-center justify-center rounded-full"
      >
        <Icon className="size-4.5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          {reference.type}
        </p>
        <p className="font-heading text-foreground group-hover:text-navy-900 mt-1 text-sm font-semibold transition-colors">
          {reference.titre}
        </p>
        <p className="text-muted-foreground mt-1 text-sm">
          {reference.organisme}
        </p>
      </div>
      <ExternalLink
        aria-hidden
        className="text-muted-foreground group-hover:text-navy-900 mt-1 size-4 shrink-0 transition-colors"
      />
    </a>
  );
}
