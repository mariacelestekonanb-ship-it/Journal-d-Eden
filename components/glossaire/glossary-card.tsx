"use client";

import { ChevronDown } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { Button } from "@/components/ui/button";
import { TermBadge } from "@/components/glossaire/term-badge";
import { DefinitionPreview } from "@/components/glossaire/definition-preview";
import { useDisclosure } from "@/hooks/use-disclosure";
import { countContenusAssocies } from "@/lib/content";
import { slugifyTerme } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { GlossaireTerme } from "@/types";

export interface GlossaryCardProps {
  terme: GlossaireTerme;
}

/**
 * Carte d'un terme du glossaire. « Voir la définition » ne navigue nulle
 * part : elle déplie `DefinitionPreview` dans la carte elle-même, à la
 * manière d'une entrée MDN ou Stripe Docs — le glossaire n'a volontairement
 * pas de route de détail par terme (voir l'ancre `id`, ciblée par la
 * recherche et par les puces « Voir aussi »).
 */
export function GlossaryCard({ terme }: GlossaryCardProps) {
  const disclosure = useDisclosure();
  const nombreContenus = countContenusAssocies(terme);
  const slug = slugifyTerme(terme.terme);
  const panelId = `${slug}-definition`;

  return (
    <Card id={slug} className="scroll-mt-28 p-6">
      <TermBadge theme={terme.theme} />
      <Heading as="h3" size="xs" className="mt-3">
        {terme.terme}
      </Heading>
      <Paragraph tone="muted" size="sm" className="mt-2 line-clamp-3">
        {terme.definition}
      </Paragraph>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-muted-foreground text-xs">
          {nombreContenus > 0
            ? `${nombreContenus} contenu${nombreContenus > 1 ? "s" : ""} associé${nombreContenus > 1 ? "s" : ""}`
            : "Aucun contenu associé"}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={disclosure.toggle}
          aria-expanded={disclosure.isOpen}
          aria-controls={panelId}
        >
          Voir la définition
          <ChevronDown
            aria-hidden
            className={cn(
              "size-4 transition-transform",
              disclosure.isOpen && "rotate-180",
            )}
          />
        </Button>
      </div>

      {disclosure.isOpen ? (
        <div id={panelId}>
          <DefinitionPreview terme={terme} />
        </div>
      ) : null}
    </Card>
  );
}
