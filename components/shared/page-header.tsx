import type { ReactNode } from "react";

import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";

export interface PageHeaderProps {
  /** Court libellé affiché au-dessus du titre (nom de la section du site). */
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}

/**
 * En-tête standard des pages de contenu (tout sauf l'accueil, qui a son
 * propre Hero). Garantit une structure identique — eyebrow, titre, chapô —
 * sur Comprendre, Veille, Glossaire, Ressources, À propos et Contact.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: PageHeaderProps) {
  return (
    <Section tone="muted" spacing="lg" className="border-border border-b">
      <div className="flex flex-col items-center text-center">
        <Badge variant="accent" className="mb-6">
          {eyebrow}
        </Badge>
        <Heading as="h1" size="xl" className="max-w-2xl">
          {title}
        </Heading>
        <Paragraph
          tone="muted"
          size="lg"
          className="mt-5 max-w-2xl text-balance"
        >
          {description}
        </Paragraph>
        {children}
      </div>
    </Section>
  );
}
