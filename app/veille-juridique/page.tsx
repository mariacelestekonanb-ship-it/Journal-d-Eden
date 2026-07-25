import type { Metadata } from "next";

import { PageHeader } from "@/components/sections/page-header";
import { VeilleExplorer } from "@/components/sections/veille-explorer";
import { veilleItems } from "@/data/veille";

export const metadata: Metadata = {
  title: "Veille juridique",
  description:
    "Toute l'actualité juridique du droit spatial et du droit du numérique : textes officiels, décisions et négociations internationales.",
};

export default function VeilleJuridiquePage() {
  return (
    <>
      <PageHeader
        eyebrow="Veille juridique"
        title="L'actualité juridique, sans détour"
        description="Textes adoptés, sanctions prononcées, négociations en cours : suivez chaque évolution significative du droit spatial et du droit du numérique."
      />

      <section className="py-16 sm:py-20">
        <div className="container-lexwatch">
          <VeilleExplorer items={veilleItems} />
        </div>
      </section>
    </>
  );
}
