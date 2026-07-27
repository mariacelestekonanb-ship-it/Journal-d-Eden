import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";

export interface EmptyStateProps extends React.ComponentProps<"div"> {
  icon?: LucideIcon;
  title: string;
  description?: string;
  /** Zone d'action optionnelle (bouton, lien…) affichée sous le texte. */
  action?: React.ReactNode;
  /** Balise du titre — h3 par défaut ; passer h2 quand l'état vide suit directement un h1 sans titre de section intermédiaire. */
  headingAs?: "h2" | "h3";
}

/**
 * Espace réservé pour un contenu absent, à venir ou filtré à zéro résultat.
 * Utilisé aussi bien pour les sections « contenu à venir » que pour les
 * résultats de recherche vides une fois les pages connectées à de vraies
 * données.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  headingAs = "h3",
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "border-border bg-muted/40 flex flex-col items-center gap-3 rounded-xl border border-dashed px-8 py-16 text-center",
        className,
      )}
      {...props}
    >
      {Icon ? (
        <span className="bg-secondary text-muted-foreground flex size-12 items-center justify-center rounded-full">
          <Icon className="size-5" />
        </span>
      ) : null}
      <Heading as={headingAs} size="sm">
        {title}
      </Heading>
      {description ? (
        <Paragraph tone="muted" className="max-w-md text-balance">
          {description}
        </Paragraph>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
