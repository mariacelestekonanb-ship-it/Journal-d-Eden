import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const paragraphVariants = cva("leading-relaxed", {
  variants: {
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
    tone: {
      default: "text-foreground",
      muted: "text-muted-foreground",
    },
  },
  defaultVariants: {
    size: "md",
    tone: "default",
  },
});

export interface ParagraphProps
  extends React.ComponentProps<"p">, VariantProps<typeof paragraphVariants> {
  asChild?: boolean;
}

/**
 * Texte courant de la plateforme (corps de texte, descriptions, légendes).
 * Utiliser `tone="muted"` pour tout texte secondaire plutôt que d'appliquer
 * une couleur ad hoc.
 */
export function Paragraph({
  size,
  tone,
  asChild = false,
  className,
  ...props
}: ParagraphProps) {
  const Comp = asChild ? Slot : "p";

  return (
    <Comp
      data-slot="paragraph"
      className={cn(paragraphVariants({ size, tone }), className)}
      {...props}
    />
  );
}
