import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface PrimaryActionsProps {
  className?: string;
  /** Libellé du bouton principal (vers `/comprendre`). */
  primaryLabel?: string;
  /** Libellé du bouton secondaire (vers `/veille-juridique`). */
  secondaryLabel?: string;
}

/**
 * Paire de boutons d'action réutilisée par le Hero, la section CTA
 * d'accueil et le CTA final de la page « À propos » — mêmes destinations
 * partout (`/comprendre`, `/veille-juridique`), libellés personnalisables
 * pour s'adapter au ton de chaque page. Conçue pour un fond bleu nuit : le
 * bouton secondaire est un `outline` clair sur fond sombre.
 */
export function PrimaryActions({
  className,
  primaryLabel = "Explorer les fiches",
  secondaryLabel = "Découvrir la veille",
}: PrimaryActionsProps) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row", className)}>
      <Button asChild variant="accent" size="lg">
        <Link href="/comprendre">
          {primaryLabel}
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </Button>
      <Button
        asChild
        variant="outline"
        size="lg"
        className="border-white/20 text-white hover:bg-white/10"
      >
        <Link href="/veille-juridique">{secondaryLabel}</Link>
      </Button>
    </div>
  );
}
