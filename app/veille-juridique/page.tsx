import type { Metadata } from "next";
import { Radar } from "lucide-react";

import { ContentPageShell } from "@/components/shared/content-page-shell";

export const metadata: Metadata = {
  title: "Veille juridique",
  description:
    "Toute l'actualité juridique du droit spatial et du droit du numérique : textes officiels, décisions et négociations internationales.",
};

export default function VeilleJuridiquePage() {
  return (
    <ContentPageShell
      eyebrow="Veille juridique"
      title="L'actualité juridique, sans détour"
      description="Textes adoptés, sanctions prononcées, négociations en cours : suivez chaque évolution significative du droit spatial et du droit du numérique."
      searchPlaceholder="Rechercher une actualité, une source…"
      icon={Radar}
      emptyTitle="La veille arrive bientôt"
      emptyDescription="Cette page listera les actualités juridiques suivies par la rédaction, classées par domaine et par date."
    />
  );
}
