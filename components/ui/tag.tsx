import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

interface TagBaseProps {
  /** État actif, pertinent uniquement lorsque `asButton` est utilisé. */
  active?: boolean;
  className?: string;
}

export type TagProps =
  | ({ asButton?: false; asChild?: false } & TagBaseProps &
      React.ComponentProps<"span">)
  | ({ asButton: true } & TagBaseProps & React.ComponentProps<"button">)
  | ({ asButton?: false; asChild: true } & TagBaseProps &
      React.ComponentProps<"span">);

/**
 * Étiquette neutre pour du métatexte (mot-clé, durée de lecture, filtre).
 * Différence avec `Badge` : `Tag` reste monochrome et discret, quand
 * `Badge` porte une signification (domaine, statut) via ses variantes de
 * couleur. `asChild` fusionne le style sur un lien (`<a>`/`Link>`) plutôt
 * que de rendre un `<span>` — pour un tag qui navigue sans être une action
 * ponctuelle (voir `asButton`).
 */
export function Tag({ active = false, className, ...props }: TagProps) {
  const sharedClassName = cn(
    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide transition-colors",
    active ? "bg-navy-900 text-white" : "bg-secondary text-muted-foreground",
    (props.asButton || props.asChild) &&
      "hover:bg-navy-900 hover:text-white focus-visible:ring-ring outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    className,
  );

  if (props.asButton) {
    const { asButton: _asButton, ...buttonProps } = props;
    return (
      <button
        type="button"
        data-slot="tag"
        aria-pressed={active}
        className={sharedClassName}
        {...buttonProps}
      />
    );
  }

  if (props.asChild) {
    const { asButton: _asButton, asChild: _asChild, ...slotProps } = props;
    return <Slot data-slot="tag" className={sharedClassName} {...slotProps} />;
  }

  const { asButton: _asButton, asChild: _asChild, ...spanProps } = props;
  return <span data-slot="tag" className={sharedClassName} {...spanProps} />;
}
