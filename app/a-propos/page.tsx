import type { Metadata } from "next";
import { Users } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Section } from "@/components/ui/section";
import { EmptyState } from "@/components/ui/empty-state";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/site-config";
import { buildMetadata } from "@/lib/metadata";
import { buildWebPageJsonLd } from "@/lib/json-ld";

const TITLE = "À propos";
const DESCRIPTION =
  "La mission de LexWatch : rendre accessible le droit spatial et le droit du numérique à travers une veille juridique rigoureuse et pédagogique.";

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/a-propos",
});

export default function AProposPage() {
  return (
    <>
      <JsonLd
        data={buildWebPageJsonLd({
          name: TITLE,
          description: DESCRIPTION,
          path: "/a-propos",
        })}
      />
      <Breadcrumb
        visuallyHidden
        items={[{ label: "Accueil", href: "/" }, { label: "À propos" }]}
      />
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
