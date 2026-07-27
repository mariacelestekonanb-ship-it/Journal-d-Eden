"use client";

import * as React from "react";
import { BookMarked } from "lucide-react";

import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Divider } from "@/components/ui/divider";
import { AlphabetNavigation } from "@/components/glossaire/alphabet-navigation";
import {
  CategoryFilter,
  type ThemeFiltre,
} from "@/components/glossaire/category-filter";
import { GlossaryCard } from "@/components/glossaire/glossary-card";
import { GlossaryCardSkeleton } from "@/components/glossaire/glossary-card-skeleton";
import { glossaireTermes } from "@/data/glossaire";
import { themes } from "@/data/themes";
import { slugifyTerme } from "@/lib/format";

export const PAGE_SIZE = 9;
const SIMULATED_LATENCY_MS = 320;

export interface GlossaryExplorerProps {
  initialTheme?: string;
}

/**
 * Liste des définitions : catégorie, navigation alphabétique et chargement
 * progressif. Les données viennent de `data/glossaire.ts` ; brancher une
 * base de données ou un CMS headless revient à remplacer ce tableau par un
 * appel réseau retournant la même forme (voir `ContentErrorState`, déjà
 * prêt pour ce cas via `app/glossaire/error.tsx`).
 */
export function GlossaryExplorer({ initialTheme }: GlossaryExplorerProps) {
  const initialThemeFiltre: ThemeFiltre =
    initialTheme && themes.some((theme) => theme.slug === initialTheme)
      ? initialTheme
      : "tous";

  const [themeFiltre, setThemeFiltre] =
    React.useState<ThemeFiltre>(initialThemeFiltre);
  const [lettreActive, setLettreActive] = React.useState<string | null>(null);
  const [visibleCount, setVisibleCount] = React.useState(PAGE_SIZE);
  const [isLoading, setIsLoading] = React.useState(false);
  const [pendingScrollHash, setPendingScrollHash] = React.useState<
    string | null
  >(null);

  React.useEffect(() => {
    setIsLoading(true);
    const timeout = window.setTimeout(
      () => setIsLoading(false),
      SIMULATED_LATENCY_MS,
    );
    return () => window.clearTimeout(timeout);
  }, [themeFiltre, lettreActive]);

  // Une suggestion de recherche pointe vers l'ancre d'un terme (#slug) :
  // au premier rendu, si l'URL cible une ancre, on lève les filtres et on
  // affiche tout, pour garantir que le terme visé est bien dans le DOM
  // avant de défiler jusqu'à lui.
  React.useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;

    const cible = glossaireTermes.find(
      (terme) => slugifyTerme(terme.terme) === hash,
    );
    if (!cible) return;

    setThemeFiltre("tous");
    setLettreActive(null);
    setVisibleCount(glossaireTermes.length);
    setPendingScrollHash(hash);
  }, []);

  React.useEffect(() => {
    if (!pendingScrollHash || isLoading) return;
    document
      .getElementById(pendingScrollHash)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    setPendingScrollHash(null);
  }, [pendingScrollHash, isLoading]);

  const lettresDisponibles = React.useMemo(() => {
    const pool = glossaireTermes.filter(
      (terme) => themeFiltre === "tous" || terme.theme === themeFiltre,
    );
    return Array.from(new Set(pool.map((terme) => terme.lettre))).sort((a, b) =>
      a.localeCompare(b),
    );
  }, [themeFiltre]);

  function updateTheme(value: ThemeFiltre) {
    setThemeFiltre(value);
    setVisibleCount(PAGE_SIZE);
    setLettreActive((current) => {
      if (!current) return current;
      const pool = glossaireTermes.filter(
        (terme) => value === "tous" || terme.theme === value,
      );
      const disponibles = new Set(pool.map((terme) => terme.lettre));
      return disponibles.has(current) ? current : null;
    });
  }

  function updateLettre(value: string | null) {
    setLettreActive(value);
    setVisibleCount(PAGE_SIZE);
  }

  function resetFiltres() {
    setThemeFiltre("tous");
    setLettreActive(null);
    setVisibleCount(PAGE_SIZE);
  }

  const filtered = React.useMemo(() => {
    return glossaireTermes
      .filter((terme) => themeFiltre === "tous" || terme.theme === themeFiltre)
      .filter((terme) => !lettreActive || terme.lettre === lettreActive)
      .sort((a, b) => a.terme.localeCompare(b.terme, "fr"));
  }, [themeFiltre, lettreActive]);

  const visibleItems = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Heading as="h2" size="lg">
          Toutes les définitions
        </Heading>
        <Paragraph tone="muted" size="lg" className="mt-4 max-w-2xl">
          Chaque terme renvoie vers les fiches pédagogiques et les analyses de
          LexWatch qui l&apos;expliquent plus en détail.
        </Paragraph>
      </div>

      <div className="border-border bg-card flex flex-col gap-5 rounded-xl border p-5">
        <CategoryFilter value={themeFiltre} onChange={updateTheme} />
        <Divider />
        <div className="flex flex-col gap-2">
          <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Parcourir par lettre
          </span>
          <AlphabetNavigation
            lettresDisponibles={lettresDisponibles}
            lettreActive={lettreActive}
            onSelect={updateLettre}
          />
        </div>
      </div>

      <div role="status" aria-live="polite">
        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: PAGE_SIZE }).map((_, index) => (
              <GlossaryCardSkeleton key={index} />
            ))}
          </div>
        ) : visibleItems.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleItems.map((terme) => (
              <GlossaryCard key={terme.terme} terme={terme} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={BookMarked}
            title="Aucune définition"
            description="Aucun terme ne correspond à ces filtres pour le moment. Essayez d'élargir votre sélection."
            action={
              <Button variant="outline" onClick={resetFiltres}>
                Réinitialiser les filtres
              </Button>
            }
          />
        )}
      </div>

      {!isLoading && hasMore ? (
        <Button
          variant="outline"
          size="lg"
          className="mx-auto"
          onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
        >
          Charger plus de définitions
        </Button>
      ) : null}
    </div>
  );
}
