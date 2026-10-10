import Link from "next/link";
import { FileQuestion } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

/**
 * 404 propre à l'espace d'administration : sans ce fichier, `notFound()`
 * appelé depuis une route `/admin/**` (voir par ex.
 * `app/admin/fiches/[id]/page.tsx`) retomberait sur `app/not-found.tsx`,
 * pensé pour l'identité claire du site public — un contraste visuel
 * incohérent une fois rendu à l'intérieur de la coquille sombre de
 * l'administration (`AdminShell`).
 *
 * Limite connue de Next.js (App Router) : un `not-found.tsx` imbriqué
 * (hors racine de `app/`) rend le bon contenu mais renvoie un statut HTTP
 * 200 plutôt que 404. Sans conséquence ici — `/admin` est déjà exclu du
 * crawl (`robots.ts`) et de l'indexation (`robots: { index: false }` dans
 * `app/admin/layout.tsx`) — mais à garder en tête si ce comportement HTTP
 * devient un jour significatif pour cette section.
 */
export default function AdminNotFound() {
  return (
    <EmptyState
      icon={FileQuestion}
      headingAs="h1"
      title="Contenu introuvable"
      description="Cet élément n'existe pas ou a été supprimé."
      action={
        <Button asChild variant="accent">
          <Link href="/admin">Retour au tableau de bord</Link>
        </Button>
      }
    />
  );
}
