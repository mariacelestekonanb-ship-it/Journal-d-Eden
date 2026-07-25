import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const headingVariants = cva("font-heading text-balance text-foreground", {
  variants: {
    size: {
      xs: "text-lg font-semibold",
      sm: "text-xl font-semibold",
      md: "text-2xl font-bold",
      lg: "text-3xl font-bold sm:text-4xl",
      xl: "text-4xl font-bold sm:text-5xl lg:text-6xl",
    },
    tracking: {
      default: "tracking-tight",
      tight: "tracking-tighter",
    },
  },
  defaultVariants: {
    size: "md",
    tracking: "default",
  },
});

type HeadingElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface HeadingProps
  extends
    Omit<React.ComponentProps<"h1">, "color">,
    VariantProps<typeof headingVariants> {
  /** Balise HTML rendue — indépendante du style visuel (`size`). */
  as?: HeadingElement;
  asChild?: boolean;
}

/**
 * Titre typographique de la plateforme. Le niveau sémantique (`as`, pour le
 * SEO et l'accessibilité) est volontairement découplé de l'apparence
 * (`size`) : un `<h2>` peut visuellement être aussi grand qu'un `<h1>`.
 */
export function Heading({
  as: Tag = "h2",
  size,
  tracking,
  asChild = false,
  className,
  ...props
}: HeadingProps) {
  const Comp = asChild ? Slot : Tag;

  return (
    <Comp
      data-slot="heading"
      className={cn(headingVariants({ size, tracking }), className)}
      {...props}
    />
  );
}
