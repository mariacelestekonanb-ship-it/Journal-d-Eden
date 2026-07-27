import type { Metadata } from "next";
import { FileText } from "lucide-react";

import { ContentPageShell } from "@/components/shared/content-page-shell";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/metadata";
import { buildCollectionPageJsonLd } from "@/lib/json-ld";

const TITLE = "Ressources";
const DESCRIPTION =
  "Une sélection de textes officiels, rapports et guides pratiques pour approfondir le droit spatial et le droit du numérique.";

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/ressources",
});

export default function RessourcesPage() {
  return (
    <>
      <JsonLd
        data={buildCollectionPageJsonLd({
          name: TITLE,
          description: DESCRIPTION,
          path: "/ressources",
        })}
      />
      <Breadcrumb
        visuallyHidden
        items={[{ label: "Accueil", href: "/" }, { label: "Ressources" }]}
      />
      <ContentPageShell
        eyebrow="Ressources"
        title="Les sources, pas les rumeurs"
        description="Textes officiels, rapports institutionnels et guides pratiques soigneusement sélectionnés pour aller plus loin sur chaque sujet."
        searchPlaceholder="Rechercher un texte, un organisme…"
        icon={FileText}
        emptyTitle="Les ressources arrivent bientôt"
        emptyDescription="Cette page listera les textes officiels, rapports et guides pratiques recommandés par la rédaction."
      />
    </>
  );
}
