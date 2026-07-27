import type { Metadata } from "next";

import { GlossaireHero } from "@/components/glossaire/hero";
import { SearchExperience } from "@/components/shared/search-experience";
import { Section } from "@/components/ui/section";
import { GlossaryExplorer } from "@/components/glossaire/glossary-explorer";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { JsonLd } from "@/components/seo/json-ld";
import { glossaireTermes } from "@/data/glossaire";
import { slugifyTerme } from "@/lib/format";
import { getThemeBySlug } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";
import { buildDefinedTermSetJsonLd } from "@/lib/json-ld";

const TITLE = "Glossaire";
const DESCRIPTION =
  "Le glossaire LexWatch : toutes les notions clés du droit spatial et du droit du numérique, classées par ordre alphabétique.";

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/glossaire",
});

interface GlossairePageProps {
  searchParams: Promise<{ theme?: string; q?: string }>;
}

/**
 * Page Glossaire : porte d'entrée vers les connaissances de LexWatch, pas
 * un simple dictionnaire. `theme` et `q` sont lus côté serveur pour
 * pré-filtrer/pré-remplir la page sans JavaScript — même principe que
 * Comprendre et Veille juridique. Chaque terme n'a volontairement pas de
 * route de détail : la recherche cible directement l'ancre de sa carte
 * dans la liste (voir `GlossaryExplorer`), qui révèle fiches et analyses
 * associées au clic sur « Voir la définition ».
 */
export default async function GlossairePage({
  searchParams,
}: GlossairePageProps) {
  const { theme, q } = await searchParams;

  return (
    <>
      <JsonLd
        data={buildDefinedTermSetJsonLd(
          glossaireTermes.map((terme) => ({
            name: terme.terme,
            description: terme.definition,
            themeLabel: getThemeBySlug(terme.theme)?.titre ?? terme.theme,
          })),
        )}
      />
      <Breadcrumb
        visuallyHidden
        items={[{ label: "Accueil", href: "/" }, { label: "Glossaire" }]}
      />
      <GlossaireHero />

      <SearchExperience
        items={glossaireTermes.map((terme) => ({
          key: terme.terme,
          label: terme.terme,
          href: `/glossaire#${slugifyTerme(terme.terme)}`,
        }))}
        placeholder="Rechercher un terme, un sigle, une notion…"
        panelId="glossaire-search-panel"
        recentSearches={["RGPD", "AI Act", "Débris orbital"]}
        initialQuery={q}
        resultLabel="terme"
      />

      <Section>
        <GlossaryExplorer initialTheme={theme} />
      </Section>
    </>
  );
}
