import * as React from "react";

import { cn } from "@/lib/utils";

interface TagBaseProps {
  /** État actif, pertinent uniquement lorsque `asButton` est utilisé. */
  active?: boolean;
  className?: string;
}

export type TagProps =
  | ({ asButton?: false } & TagBaseProps & React.ComponentProps<"span">)
  | ({ asButton: true } & TagBaseProps & React.ComponentProps<"button">);

/**
 * Étiquette neutre pour du métatexte (mot-clé, durée de lecture, filtre).
 * Différence avec `Badge` : `Tag` reste monochrome et discret, quand
 * `Badge` porte une signification (domaine, statut) via ses variantes de
 * couleur.
 */
export function Tag({ active = false, className, ...props }: TagProps) {
  const sharedClassName = cn(
    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide transition-colors",
    active ? "bg-navy-900 text-white" : "bg-secondary text-muted-foreground",
    props.asButton && "hover:bg-navy-900 hover:text-white",
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

  const { asButton: _asButton, ...spanProps } = props;
  return <span data-slot="tag" className={sharedClassName} {...spanProps} />;
}
