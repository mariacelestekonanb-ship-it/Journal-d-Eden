import { CheckCircle2 } from "lucide-react";

export interface AutosaveIndicatorProps {
  lastSavedAt: Date | null;
}

/** Indicateur discret de sauvegarde automatique (voir `hooks/use-autosave.ts`) — silencieux tant qu'aucune sauvegarde n'a encore eu lieu. */
export function AutosaveIndicator({ lastSavedAt }: AutosaveIndicatorProps) {
  if (!lastSavedAt) return null;

  return (
    <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
      <CheckCircle2 className="size-3.5" aria-hidden />
      Enregistré automatiquement à{" "}
      {lastSavedAt.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </span>
  );
}
