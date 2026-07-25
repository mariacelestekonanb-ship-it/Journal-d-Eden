import type { Metadata } from "next";
import { FileText } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Section } from "@/components/ui/section";
import { EmptyState } from "@/components/ui/empty-state";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: `Mentions légales de ${siteConfig.name}.`,
  robots: { index: false, follow: true },
};

export default function MentionsLegalesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Informations légales"
        title="Mentions légales"
        description="Éditeur, hébergeur et informations réglementaires relatives à la plateforme."
      />

      <Section>
        <EmptyState
          icon={FileText}
          title="Cette page arrive bientôt"
          description="Les mentions légales complètes seront publiées ici."
        />
      </Section>
    </>
  );
}
