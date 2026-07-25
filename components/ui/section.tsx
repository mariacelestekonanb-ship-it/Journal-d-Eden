import * as React from "react";

import { cn } from "@/lib/utils";
import { Container, type ContainerProps } from "@/components/ui/container";

export interface SectionProps extends React.ComponentProps<"section"> {
  /** Espacement vertical de la section. `none` désactive le padding (cas des sections déjà espacées par leur contenu). */
  spacing?: "none" | "sm" | "default" | "lg";
  /** Couleur de fond de la section. */
  tone?: "default" | "muted" | "navy";
  /** Largeur du conteneur interne, transmise à `<Container>`. Passer `false` pour ne pas englober le contenu dans un conteneur. */
  containerSize?: ContainerProps["size"] | false;
}

const spacingClasses: Record<NonNullable<SectionProps["spacing"]>, string> = {
  none: "",
  sm: "py-10 sm:py-12",
  default: "py-16 sm:py-20",
  lg: "py-20 sm:py-28",
};

const toneClasses: Record<NonNullable<SectionProps["tone"]>, string> = {
  default: "bg-background text-foreground",
  muted: "bg-muted/40 text-foreground",
  navy: "bg-navy-950 text-white",
};

/**
 * Bloc de mise en page vertical standard d'une page : gère l'espacement,
 * la teinte de fond et le conteneur horizontal en un seul composant, pour
 * que chaque page compose ses blocs de la même façon.
 */
export function Section({
  spacing = "default",
  tone = "default",
  containerSize = "default",
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      data-slot="section"
      className={cn(spacingClasses[spacing], toneClasses[tone], className)}
      {...props}
    >
      {containerSize === false ? (
        children
      ) : (
        <Container size={containerSize}>{children}</Container>
      )}
    </section>
  );
}
