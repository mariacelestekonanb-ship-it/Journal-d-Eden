"use client";

import * as React from "react";
import { Search, X, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface SearchInputProps extends Omit<
  React.ComponentProps<"input">,
  "type" | "size" | "value" | "onChange"
> {
  value: string;
  onValueChange: (value: string) => void;
  onClear: () => void;
  isLoading?: boolean;
}

/**
 * Champ de recherche de la recherche globale : contrôlé par valeur (pas par
 * événement DOM brut), avec bouton d'effacement et indicateur de recherche
 * en cours. Distinct de `components/ui/search-input.tsx` (icône + `<input>`
 * nu, utilisé par les moteurs de recherche des pages Comprendre/Veille
 * juridique/Glossaire) : celui-ci porte en plus l'état combobox (voir
 * `SearchDialog`) et l'affordance de chargement attendues d'une recherche
 * de type palette de commandes.
 */
export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(
    { value, onValueChange, onClear, isLoading = false, className, ...props },
    ref,
  ) {
    return (
      <div className="relative flex-1">
        <Search
          aria-hidden
          className="text-muted-foreground pointer-events-none absolute top-1/2 left-5 size-4.5 -translate-y-1/2"
        />
        <Input
          ref={ref}
          type="text"
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          className={cn(
            "h-14 border-none pr-11 pl-12 text-base shadow-none focus-visible:ring-0",
            className,
          )}
          {...props}
        />
        {isLoading ? (
          <Loader2
            aria-hidden
            className="text-muted-foreground absolute top-1/2 right-5 size-4 -translate-y-1/2 animate-spin"
          />
        ) : value ? (
          <button
            type="button"
            onClick={onClear}
            aria-label="Effacer la recherche"
            className="text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:ring-ring absolute top-1/2 right-3.5 flex size-7 -translate-y-1/2 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>
    );
  },
);
