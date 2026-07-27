import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Conteneur générique en carte, composé de sous-composants
 * (`CardHeader`, `CardTitle`, `CardDescription`, `CardContent`,
 * `CardFooter`) à assembler selon le besoin — aucun ne rend le fond ou la
 * bordure sans le `<Card>` parent.
 */
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "border-border bg-card text-card-foreground flex flex-col rounded-xl border shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5 p-6", className)}
      {...props}
    />
  );
}

interface CardTitleProps extends React.ComponentProps<"h3"> {
  /** Balise HTML rendue — h3 par défaut ; passer h2 quand la carte suit directement un h1 sans titre de section intermédiaire. */
  as?: "h2" | "h3" | "h4";
}

function CardTitle({ as: Tag = "h3", className, ...props }: CardTitleProps) {
  return (
    <Tag
      data-slot="card-title"
      className={cn("text-lg leading-snug font-semibold", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6 pb-6", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 pb-6", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
