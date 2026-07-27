import type { Metadata } from "next";
import { FileText } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Section } from "@/components/ui/section";
import { EmptyState } from "@/components/ui/empty-state";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { JsonLd } from "@/components/seo/json-ld";
import { ContentBlocks } from "@/components/shared/content-blocks";
import { siteConfig } from "@/lib/site-config";
import { buildMetadata } from "@/lib/metadata";
import { buildWebPageJsonLd } from "@/lib/json-ld";
import { siteSettingsStore } from "@/lib/admin/repository";

const TITLE = "Mentions légales";
const DESCRIPTION = `Mentions légales de ${siteConfig.name}.`;

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/mentions-legales",
  noIndex: true,
});

export default async function MentionsLegalesPage() {
  const settings = await siteSettingsStore.get();
  const blocks = settings.legal.mentionsLegales;

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
        {blocks.length > 0 ? (
          <ContentBlocks blocks={blocks} />
        ) : (
          <EmptyState
            icon={FileText}
            headingAs="h2"
            title="Cette page arrive bientôt"
            description="Les mentions légales complètes seront publiées ici."
          />
        )}
      </Section>
    </>
  );
}
