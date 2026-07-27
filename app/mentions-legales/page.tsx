import type { Metadata } from "next";
import { FileText } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Section } from "@/components/ui/section";
import { EmptyState } from "@/components/ui/empty-state";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/site-config";
import { buildMetadata } from "@/lib/metadata";
import { buildWebPageJsonLd } from "@/lib/json-ld";

const TITLE = "Mentions légales";
const DESCRIPTION = `Mentions légales de ${siteConfig.name}.`;

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/mentions-legales",
  noIndex: true,
});

export default function MentionsLegalesPage() {
  return (
    <>
      <JsonLd
        data={buildWebPageJsonLd({
          name: TITLE,
          description: DESCRIPTION,
          path: "/mentions-legales",
        })}
      />
      <Breadcrumb
        visuallyHidden
        items={[{ label: "Accueil", href: "/" }, { label: "Mentions légales" }]}
      />
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
