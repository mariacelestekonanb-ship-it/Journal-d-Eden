import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Section } from "@/components/ui/section";
import { EmptyState } from "@/components/ui/empty-state";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Confidentialité",
  description: `Politique de confidentialité de ${siteConfig.name}.`,
  robots: { index: false, follow: true },
};

export default function ConfidentialitePage() {
  return (
    <>
      <PageHeader
        eyebrow="Informations légales"
        title="Politique de confidentialité"
        description="Comment LexWatch collecte, utilise et protège les données de ses visiteurs."
      />

      <Section>
        <EmptyState
          icon={ShieldCheck}
          title="Cette page arrive bientôt"
          description="La politique de confidentialité complète sera publiée ici."
        />
      </Section>
    </>
  );
}
