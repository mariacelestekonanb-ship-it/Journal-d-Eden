import type { Metadata } from "next";
import { HelpCircle } from "lucide-react";

import { ContentPageShell } from "@/components/shared/content-page-shell";

export const metadata: Metadata = {
  title: "Comprendre",
  description:
    "Les fondamentaux du droit spatial et du droit du numérique expliqués simplement : questions clés, réponses claires et niveaux de complexité.",
};

export default function ComprendrePage() {
  return (
    <ContentPageShell
      eyebrow="Comprendre"
      title="Les fondamentaux, sans jargon"
      description="Chaque notion clé du droit spatial et du droit du numérique expliquée en une question et une réponse claire, classée par niveau de complexité."
      searchPlaceholder="Rechercher une question…"
      icon={HelpCircle}
      emptyTitle="Les questions arrivent bientôt"
      emptyDescription="Cette page listera les questions essentielles du droit spatial et du droit du numérique, avec leurs réponses détaillées."
    />
  );
}
