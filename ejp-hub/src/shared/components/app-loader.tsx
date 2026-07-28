import { Loader2 } from "lucide-react";

import { cn } from "@/shared/lib/utils";

export interface AppLoaderProps {
  label?: string;
  fullPage?: boolean;
  className?: string;
}

/** Indicateur de chargement générique (spinner), pour un état de chargement en ligne ou plein écran. */
export function AppLoader({ label, fullPage, className }: AppLoaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 text-muted-foreground",
        fullPage ? "min-h-[50vh]" : "py-10",
        className,
      )}
      role="status"
    >
      <Loader2 className="size-6 animate-spin" />
      {label && <p className="text-sm">{label}</p>}
    </div>
  );
}
