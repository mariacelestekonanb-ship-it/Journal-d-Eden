import * as React from "react";

import { cn } from "@/lib/utils";

/** Zone de texte multiligne du design system — pendant de `<Input>` pour le contenu long (corps de bloc, citation, code). */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input bg-background text-foreground placeholder:text-muted-foreground flex min-h-24 w-full rounded-xl border px-4 py-3 text-sm shadow-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-ring focus-visible:ring-ring/40 outline-none focus-visible:ring-2",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
