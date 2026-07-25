import type { Metadata } from "next";

import { PageHeader } from "@/components/sections/page-header";
import { RessourcesExplorer } from "@/components/sections/ressources-explorer";
import { ressources } from "@/data/ressources";

export const metadata: Metadata = {
  title: "Ressources",
  description:
    "Une sélection de textes officiels, rapports et guides pratiques pour approfondir le droit spatial et le droit du numérique.",
};

export default function RessourcesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Ressources"
        title="Les sources, pas les rumeurs"
        description="Textes officiels, rapports institutionnels et guides pratiques soigneusement sélectionnés pour aller plus loin sur chaque sujet."
      />

      <section className="py-16 sm:py-20">
        <div className="container-lexwatch">
          <RessourcesExplorer ressources={ressources} />
        </div>
      </section>
    </>
  );
}
