import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Section } from "@/components/ui/section";
import { EmptyState } from "@/components/ui/empty-state";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/site-config";
import { buildMetadata } from "@/lib/metadata";
import { buildWebPageJsonLd } from "@/lib/json-ld";

const TITLE = "Confidentialité";
const DESCRIPTION = `Politique de confidentialité de ${siteConfig.name}.`;

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/confidentialite",
  noIndex: true,
});

export default function ConfidentialitePage() {
  return (
    <>
      <JsonLd
        data={buildWebPageJsonLd({
          name: TITLE,
          description: DESCRIPTION,
          path: "/confidentialite",
        })}
      />
      <Breadcrumb
        visuallyHidden
        items={[{ label: "Accueil", href: "/" }, { label: "Confidentialité" }]}
      />
      <PageHeader
        eyebrow="Informations légales"
        title="Politique de confidentialité"
        description="Comment LexWatch collecte, utilise et protège les données de ses visiteurs."
      />

      <Section>
        <EmptyState
          icon={ShieldCheck}
          headingAs="h2"
          title="Cette page arrive bientôt"
          description="La politique de confidentialité complète sera publiée ici."
        />
      </Section>
    </>
  );
}
