import { Loader2 } from "lucide-react";

import { Section } from "@/components/ui/section";

/**
 * Repli de chargement générique, utilisé par toute route qui n'a pas son
 * propre `loading.tsx` plus spécifique (voir par ex.
 * `app/comprendre/[slug]/loading.tsx`, qui prend le dessus grâce à sa
 * proximité dans l'arborescence). Les données du site public étant
 * aujourd'hui statiques, ce repli n'est visible qu'un instant ; il
 * deviendra pertinent dès qu'une source de données réelle (asynchrone)
 * sera branchée.
 */
export default function RootLoading() {
  return (
    <Section spacing="lg">
      <div
        role="status"
        className="text-muted-foreground flex flex-col items-center gap-3 py-16 text-center"
      >
        <Loader2 className="size-6 animate-spin" aria-hidden />
        <span className="text-sm">Chargement…</span>
      </div>
    </Section>
  );
}
