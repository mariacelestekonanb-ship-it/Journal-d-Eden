import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/** Sélecteur natif stylé du design system — pendant de `<Input>` pour les choix fermés (statut, domaine, type de référence…). */
function Select({
  className,
  children,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        data-slot="select"
        className={cn(
          "border-input bg-background text-foreground h-11 w-full appearance-none rounded-full border px-4 pr-10 text-sm shadow-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50",
          "focus-visible:border-ring focus-visible:ring-ring/40 outline-none focus-visible:ring-2",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="text-muted-foreground pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2"
      />
    </div>
  );
}

export { Select };
