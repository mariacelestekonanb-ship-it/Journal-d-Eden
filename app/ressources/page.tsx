import type { Metadata } from "next";
import { FileText } from "lucide-react";

import { ContentPageShell } from "@/components/shared/content-page-shell";

export const metadata: Metadata = {
  title: "Ressources",
  description:
    "Une sélection de textes officiels, rapports et guides pratiques pour approfondir le droit spatial et le droit du numérique.",
};

export default function RessourcesPage() {
  return (
    <ContentPageShell
      eyebrow="Ressources"
      title="Les sources, pas les rumeurs"
      description="Textes officiels, rapports institutionnels et guides pratiques soigneusement sélectionnés pour aller plus loin sur chaque sujet."
      searchPlaceholder="Rechercher un texte, un organisme…"
      icon={FileText}
      emptyTitle="Les ressources arrivent bientôt"
      emptyDescription="Cette page listera les textes officiels, rapports et guides pratiques recommandés par la rédaction."
    />
  );
}
