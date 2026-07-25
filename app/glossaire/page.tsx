import type { Metadata } from "next";
import { BookMarked } from "lucide-react";

import { ContentPageShell } from "@/components/shared/content-page-shell";

export const metadata: Metadata = {
  title: "Glossaire",
  description:
    "Le glossaire LexWatch : toutes les notions clés du droit spatial et du droit du numérique, classées par ordre alphabétique.",
};

export default function GlossairePage() {
  return (
    <ContentPageShell
      eyebrow="Glossaire"
      title="Le vocabulaire juridique, en clair"
      description="Traités, règlements, notions techniques : retrouvez la définition précise de chaque terme clé du droit spatial et du droit du numérique."
      searchPlaceholder="Rechercher un terme…"
      icon={BookMarked}
      emptyTitle="Le glossaire arrive bientôt"
      emptyDescription="Cette page listera, par ordre alphabétique, les définitions des notions clés du droit spatial et du droit du numérique."
    />
  );
}
