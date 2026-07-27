import Link from "next/link";
import { Scale } from "lucide-react";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

export interface LogoProps {
  className?: string;
  /** Variante sombre : utilisée sur fond bleu nuit (ex. Footer). */
  inverted?: boolean;
  /** Image déposée depuis /admin/reglages — remplace l'icône et le nom par défaut si présente (voir `SiteSettings.branding.logoUrl`). */
  logoUrl?: string;
}

/**
 * Marque LexWatch (icône + nom, ou logo déposé depuis les réglages),
 * utilisée par le Header, le Footer et la barre latérale d'administration.
 * Centraliser le logo ici évite toute divergence entre ces usages.
 */
export function Logo({ className, inverted = false, logoUrl }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "font-heading flex items-center gap-2.5 text-lg font-bold tracking-tight",
        inverted ? "text-white" : "text-foreground",
        className,
      )}
    >
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- fichier réellement uploadé sur disque local (voir app/api/upload/route.ts), pas une image distante à optimiser.
        <img src={logoUrl} alt={siteConfig.name} className="h-9 w-auto" />
      ) : (
        <>
          <span
            className={cn(
              "flex size-9 items-center justify-center rounded-full",
              inverted
                ? "text-gold-400 bg-white/10"
                : "bg-navy-900 text-accent",
            )}
          >
            <Scale className="size-4.5" aria-hidden />
          </span>
          {siteConfig.name}
        </>
      )}
    </Link>
  );
}
