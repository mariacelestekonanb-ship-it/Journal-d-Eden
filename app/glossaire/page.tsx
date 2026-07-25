import type { Metadata } from "next";

import { PageHeader } from "@/components/sections/page-header";
import { GlossaireExplorer } from "@/components/sections/glossaire-explorer";
import { glossaireTermes } from "@/data/glossaire";

export const metadata: Metadata = {
  title: "Glossaire",
  description:
    "Le glossaire LexWatch : toutes les notions clés du droit spatial et du droit du numérique, classées par ordre alphabétique.",
};

export default function GlossairePage() {
  return (
    <>
      <PageHeader
        eyebrow="Glossaire"
        title="Le vocabulaire juridique, en clair"
        description="Traités, règlements, notions techniques : retrouvez la définition précise de chaque terme clé du droit spatial et du droit du numérique."
      />

      <section className="py-16 sm:py-20">
        <div className="container-lexwatch">
          <GlossaireExplorer termes={glossaireTermes} />
        </div>
      </section>
    </>
  );
}
