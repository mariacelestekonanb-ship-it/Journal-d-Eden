import * as React from "react";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export interface SearchInputProps extends Omit<
  React.ComponentProps<"input">,
  "type" | "size"
> {
  containerClassName?: string;
  /** Taille du champ. `lg` est réservé aux barres de recherche pleine page. */
  size?: "default" | "lg";
}

/**
 * Champ de recherche avec icône, construit sur `<Input>`. Composant contrôlé
 * classique (`value` + `onChange`) : la logique de filtrage reste à la
 * charge de la page qui l'utilise.
 */
export function SearchInput({
  containerClassName,
  size = "default",
  className,
  placeholder = "Rechercher…",
  "aria-label": ariaLabel = "Rechercher",
  ...props
}: SearchInputProps) {
  return (
    <div className={cn("relative w-full", containerClassName)}>
      <Search
        aria-hidden
        className="text-muted-foreground pointer-events-none absolute top-1/2 left-5 size-4.5 -translate-y-1/2"
      />
      <Input
        type="search"
        placeholder={placeholder}
        aria-label={ariaLabel}
        className={cn(
          "pr-5 pl-12",
          size === "lg" && "h-14 text-base shadow-md",
          className,
        )}
        {...props}
      />
    </div>
  );
}
