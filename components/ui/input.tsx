import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Champ de saisie texte du design system. Pour un champ de recherche avec
 * icône, préférer `<SearchInput>` qui s'appuie sur ce composant.
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-input bg-background text-foreground placeholder:text-muted-foreground flex h-12 w-full rounded-full border px-5 py-2 text-sm shadow-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-ring focus-visible:ring-ring/40 outline-none focus-visible:ring-2",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
