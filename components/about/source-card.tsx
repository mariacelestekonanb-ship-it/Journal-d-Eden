import { ArrowUpRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import type { Institution } from "@/types";

export type SourceCardProps = Institution;

/** Carte de présentation d'une institution de référence — pas d'interaction complexe, juste une identification claire et un lien vers le site officiel. */
export function SourceCard({ nom, sigle, description, url }: SourceCardProps) {
  return (
    <Card className="h-full p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Heading as="h3" size="xs">
            {sigle}
          </Heading>
          <p className="text-muted-foreground text-sm">{nom}</p>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          aria-label={`Site officiel — ${nom} (nouvel onglet)`}
          className="hover:bg-secondary hover:text-foreground text-muted-foreground focus-visible:ring-ring flex size-8 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          <ArrowUpRight className="size-4" aria-hidden />
        </a>
      </div>
      <Paragraph tone="muted" size="sm" className="mt-3">
        {description}
      </Paragraph>
    </Card>
  );
}
