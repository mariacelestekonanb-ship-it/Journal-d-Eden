import * as React from "react";

import { cn } from "@/lib/utils";

export interface ContainerProps extends React.ComponentProps<"div"> {
  /**
   * Largeur maximale du conteneur.
   * - `default` : contenu éditorial standard (max-w-7xl)
   * - `narrow` : contenu textuel long (max-w-3xl), ex. articles, formulaires
   * - `full` : aucune contrainte de largeur, seulement le padding horizontal
   */
  size?: "default" | "narrow" | "full";
}

const sizeClasses: Record<NonNullable<ContainerProps["size"]>, string> = {
  default: "max-w-7xl",
  narrow: "max-w-3xl",
  full: "max-w-none",
};

/**
 * Conteneur horizontal centré avec marges latérales cohérentes.
 * Base de toute mise en page LexWatch : à utiliser à l'intérieur d'une
 * `<Section>` plutôt que de dupliquer `mx-auto px-*` dans chaque page.
 */
export function Container({
  size = "default",
  className,
  ...props
}: ContainerProps) {
  return (
    <div
      data-slot="container"
      className={cn(
        "mx-auto w-full px-6 sm:px-8 lg:px-10",
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}
