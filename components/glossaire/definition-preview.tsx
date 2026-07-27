import Link from "next/link";
import { BookOpen, Newspaper, ArrowRight } from "lucide-react";

import { Paragraph } from "@/components/ui/paragraph";
import { Tag } from "@/components/ui/tag";
import { ContentBlocks } from "@/components/shared/content-blocks";
import { getContenusAssociesResolus } from "@/lib/content";
import { slugifyTerme } from "@/lib/format";
import type { GlossaireTerme } from "@/types";

export interface DefinitionPreviewProps {
  terme: GlossaireTerme;
}

/**
 * Contenu révélé par « Voir la définition » : définition complète, termes
 * associés et surtout de vrais liens vers les fiches et analyses LexWatch
 * qui traitent ce terme — c'est ce qui transforme une définition en porte
 * d'entrée plutôt qu'en simple entrée de dictionnaire.
 */
export function DefinitionPreview({ terme }: DefinitionPreviewProps) {
  const { fiches, analyses } = getContenusAssociesResolus(terme);
  const aDuContenu = fiches.length > 0 || analyses.length > 0;

  return (
    <div className="border-border mt-4 space-y-5 border-t pt-4">
      <Paragraph tone="muted" size="sm">
        {terme.definition}
      </Paragraph>

      {terme.explication && terme.explication.length > 0 ? (
        <ContentBlocks blocks={terme.explication} />
      ) : null}

      {terme.voirAussi && terme.voirAussi.length > 0 ? (
        <div>
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Voir aussi
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {terme.voirAussi.map((autreTerme) => (
              <Tag key={autreTerme} asChild>
                <a href={`#${slugifyTerme(autreTerme)}`}>{autreTerme}</a>
              </Tag>
            ))}
          </div>
        </div>
      ) : null}

      {aDuContenu ? (
        <div className="space-y-3">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Pour aller plus loin
          </p>
          <ul className="space-y-2">
            {fiches.map((fiche) => (
              <li key={fiche.slug}>
                <Link
                  href={`/comprendre/${fiche.slug}`}
                  className="group text-foreground hover:text-navy-900 focus-visible:ring-ring flex items-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  <BookOpen
                    className="text-muted-foreground size-4 shrink-0"
                    aria-hidden
                  />
                  <span className="line-clamp-1">{fiche.question}</span>
                  <ArrowRight
                    aria-hidden
                    className="size-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </Link>
              </li>
            ))}
            {analyses.map((analyse) => (
              <li key={analyse.slug}>
                <Link
                  href={`/veille-juridique/${analyse.slug}`}
                  className="group text-foreground hover:text-navy-900 focus-visible:ring-ring flex items-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  <Newspaper
                    className="text-muted-foreground size-4 shrink-0"
                    aria-hidden
                  />
                  <span className="line-clamp-1">{analyse.titre}</span>
                  <ArrowRight
                    aria-hidden
                    className="size-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <Paragraph tone="muted" size="sm" className="italic">
          Aucun contenu associé pour le moment.
        </Paragraph>
      )}
    </div>
  );
}
