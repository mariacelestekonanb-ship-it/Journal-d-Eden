import { Loader2 } from "lucide-react";

/**
 * Repli de chargement de l'espace d'administration — distinct de
 * `app/loading.tsx` (site public) pour rester visuellement cohérent avec
 * `AdminShell` plutôt que de retomber sur l'identité graphique publique.
 */
export default function AdminLoading() {
  return (
    <div
      role="status"
      className="text-muted-foreground flex flex-col items-center gap-3 py-24 text-center"
    >
      <Loader2 className="size-6 animate-spin" aria-hidden />
      <span className="text-sm">Chargement…</span>
    </div>
  );
}
