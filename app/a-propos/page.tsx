import type { Metadata } from "next";
import { Users } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Section } from "@/components/ui/section";
import { EmptyState } from "@/components/ui/empty-state";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "La mission de LexWatch : rendre accessible le droit spatial et le droit du numérique à travers une veille juridique rigoureuse et pédagogique.",
};

export default function AProposPage() {
  return (
    <>
      <PageHeader
        eyebrow="À propos"
        title={`À propos de ${siteConfig.name}`}
        description={siteConfig.description}
      />

      <Section>
        <EmptyState
          icon={Users}
          title="Cette page arrive bientôt"
          description="Mission, valeurs et équipe éditoriale seront présentées ici."
        />
      </Section>
    </>
  );
}
