import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

export interface AppSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Regroupe un bloc de contenu de page avec un titre optionnel, pour garder
 * un rythme vertical et un espacement cohérents entre les sections.
 */
export function AppSection({ title, description, children, className }: AppSectionProps) {
  return (
    <section className={cn("space-y-3", className)}>
      {(title || description) && (
        <div className="space-y-1">
          {title && <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
}
