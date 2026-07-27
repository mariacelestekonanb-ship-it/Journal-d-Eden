import { Info, AlertTriangle, Quote, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { LegalReference } from "@/components/shared/legal-reference";
import type { ContentBlock } from "@/types";

export interface ContentBlocksProps {
  blocks: ContentBlock[];
}

/**
 * Rendu d'un corps de texte long par blocs typés : titres, paragraphes,
 * encadrés, listes, citations, tableaux, références juridiques, images,
 * séparateurs et boutons. Modèle volontairement simple — chaque bloc est
 * une donnée, pas du HTML brut — pour rester compatible avec un futur CMS
 * headless sans jamais interpréter de markup non maîtrisé. Réutilisé par
 * « Notre explication » (fiche pédagogique), « Notre analyse » (analyse de
 * veille) et « Explication » (glossaire) : le même bloc s'affiche partout
 * à l'identique, qu'il ait été rédigé depuis l'éditeur admin ou saisi en
 * dur dans `data/*.ts`.
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

        if (block.type === "subheading") {
          return (
            <Heading
              key={index}
              as="h4"
              size="xs"
              className="text-muted-foreground pt-1"
            >
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

        if (block.type === "legal-reference") {
          return <LegalReference key={index} reference={block.reference} />;
        }

        if (block.type === "image") {
          return (
            <figure key={index} className="space-y-2">
              {/* eslint-disable-next-line @next/next/no-img-element -- URLs de médiathèque factices, non gérées par l'optimiseur d'images Next.js. */}
              <img
                src={block.url}
                alt={block.alt}
                className="border-border w-full rounded-xl border object-cover"
              />
              {block.caption ? (
                <figcaption className="text-muted-foreground text-center text-xs">
                  {block.caption}
                </figcaption>
              ) : null}
            </figure>
          );
        }

        if (block.type === "separator") {
          return <Divider key={index} className="my-2" />;
        }

        if (block.type === "button") {
          return (
            <Button key={index} asChild variant="accent">
              <a href={block.href} target="_blank" rel="noreferrer">
                {block.label}
                <ArrowRight className="size-4" aria-hidden />
              </a>
            </Button>
          );
        }

        if (block.type === "table") {
          return (
            <div
              key={index}
              className="border-border overflow-x-auto rounded-xl border"
            >
              <table className="w-full min-w-[28rem] text-left text-sm">
                <thead className="border-border bg-muted/40 border-b">
                  <tr>
                    {block.headers.map((header, headerIndex) => (
                      <th
                        key={headerIndex}
                        scope="col"
                        className="text-foreground px-4 py-3 font-medium"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-border divide-y">
                  {block.rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="text-muted-foreground px-4 py-3"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
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
