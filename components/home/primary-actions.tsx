import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface PrimaryActionsProps {
  className?: string;
}

/**
 * Paire de boutons d'action réutilisée par le Hero et la section CTA
 * (« Explorer les fiches » / « Découvrir la veille »). Conçue pour un fond
 * bleu nuit : le bouton secondaire est un `outline` clair sur fond sombre.
 */
export function PrimaryActions({ className }: PrimaryActionsProps) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row", className)}>
      <Button asChild variant="accent" size="lg">
        <Link href="/comprendre">
          Explorer les fiches
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </Button>
      <Button
        asChild
        variant="outline"
        size="lg"
        className="border-white/20 text-white hover:bg-white/10"
      >
        <Link href="/veille-juridique">Découvrir la veille</Link>
      </Button>
    </div>
  );
}
