import Link from "next/link";
import { Scale } from "lucide-react";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

export interface LogoProps {
  className?: string;
  /** Variante sombre : utilisée sur fond bleu nuit (ex. Footer). */
  inverted?: boolean;
}

/**
 * Marque LexWatch (icône + nom), utilisée par le Header et le Footer.
 * Centraliser le logo ici évite toute divergence entre les deux usages.
 */
export function Logo({ className, inverted = false }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "font-heading flex items-center gap-2.5 text-lg font-bold tracking-tight",
        inverted ? "text-white" : "text-foreground",
        className,
      )}
    >
      <span
        className={cn(
          "flex size-9 items-center justify-center rounded-full",
          inverted ? "text-gold-400 bg-white/10" : "bg-navy-900 text-accent",
        )}
      >
        <Scale className="size-4.5" aria-hidden />
      </span>
      {siteConfig.name}
    </Link>
  );
}
