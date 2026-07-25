import { Info, AlertTriangle, Quote } from "lucide-react";

import { cn } from "@/lib/utils";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import type { ContentBlock } from "@/types";

export interface ContentBlocksProps {
  blocks: ContentBlock[];
}

/**
 * Rendu d'un corps de texte long par blocs typés : paragraphes, sous-titres,
 * encadrés, listes et citations. Modèle volontairement simple — chaque bloc
 * est une donnée, pas du HTML brut — pour rester compatible avec un futur
 * CMS headless sans jamais interpréter de markup non maîtrisé. Réutilisé par
 * « Notre explication » (fiche pédagogique) et « Notre analyse » (analyse de
 * veille juridique).
 */
export function ContentBlocks({ blocks }: ContentBlocksProps) {
  return (
    <div className="space-y-5">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          return (
            <Heading key={index} as="h3" size="sm" className="pt-2">
              {block.text}
            </Heading>
          );
        }

        if (block.type === "paragraph") {
          return (
            <Paragraph key={index} tone="muted">
              {block.text}
            </Paragraph>
          );
        }

        if (block.type === "quote") {
          return (
            <blockquote
              key={index}
              className="border-accent bg-muted/60 flex gap-3 rounded-xl border-l-4 py-4 pr-5 pl-4"
            >
              <Quote
                aria-hidden
                className="text-accent mt-0.5 size-4.5 shrink-0"
              />
              <div>
                <Paragraph className="text-foreground italic">
                  {block.text}
                </Paragraph>
                {block.source ? (
                  <p className="text-muted-foreground mt-2 text-sm font-medium">
                    — {block.source}
                  </p>
                ) : null}
              </div>
            </blockquote>
          );
        }

        if (block.type === "callout") {
          const isWarning = block.tone === "warning";
          const Icon = isWarning ? AlertTriangle : Info;

          return (
            <div
              key={index}
              className={cn(
                "flex gap-3 rounded-xl border p-5",
                isWarning
                  ? "border-gold-300/60 bg-gold-100/60"
                  : "border-border bg-muted/60",
              )}
            >
              <Icon
                aria-hidden
                className={cn(
                  "mt-0.5 size-4.5 shrink-0",
                  isWarning ? "text-gold-600" : "text-navy-900",
                )}
              />
              <Paragraph size="sm" className="text-foreground">
                {block.text}
              </Paragraph>
            </div>
          );
        }

        const ListTag = block.ordered ? "ol" : "ul";
        return (
          <ListTag
            key={index}
            className={cn(
              "text-muted-foreground space-y-2 pl-5 text-base leading-relaxed",
              block.ordered ? "list-decimal" : "list-disc",
            )}
          >
            {block.items.map((item, itemIndex) => (
              <li key={itemIndex} className="pl-1">
                {item}
              </li>
            ))}
          </ListTag>
        );
      })}
    </div>
  );
}
