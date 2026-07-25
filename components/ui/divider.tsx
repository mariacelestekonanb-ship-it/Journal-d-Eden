import * as React from "react";

import { cn } from "@/lib/utils";

export interface DividerProps extends React.ComponentProps<"div"> {
  orientation?: "horizontal" | "vertical";
}

/**
 * Séparateur visuel. Purement décoratif (`role="none"`/`aria-hidden`) : ne
 * pas l'utiliser pour transmettre une structure de contenu, réservé au
 * `<Divider>` accompagné d'un titre lisible par les lecteurs d'écran.
 */
export function Divider({
  orientation = "horizontal",
  className,
  ...props
}: DividerProps) {
  return (
    <div
      role="none"
      data-slot="divider"
      data-orientation={orientation}
      className={cn(
        "bg-border shrink-0",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
      {...props}
    />
  );
}
