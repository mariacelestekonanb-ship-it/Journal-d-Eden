"use client";

import * as React from "react";
import { FileQuestion } from "lucide-react";

import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  FicheFiltersBar,
  type NiveauFiltre,
  type SortKey,
  type ThemeFiltre,
} from "@/components/comprendre/fiche-filters-bar";
import { FicheListItem } from "@/components/comprendre/fiche-list-item";
import { FicheListSkeleton } from "@/components/comprendre/fiche-list-skeleton";
import { questions } from "@/data/questions";
import { themes } from "@/data/themes";

const PAGE_SIZE = 6;
const SIMULATED_LATENCY_MS = 320;

export interface AllFichesExplorerProps {
  initialTheme?: string;
}

/**
 * Bibliothèque complète des fiches : filtres (thème, niveau), tri
 * (alphabétique / plus récent) et chargement progressif. Les données
 * viennent de `data/questions.ts` ; brancher une base de données revient à
 * remplacer les deux tableaux importés par un appel réseau retournant la
 * même forme (voir aussi `FicheErrorState`, prêt pour ce cas).
 *
 * Le délai de chargement simulé sur changement de filtre n'existe que pour
 * donner à voir l'état `chargement` avant qu'une vraie requête n'existe.
 */
export function AllFichesExplorer({ initialTheme }: AllFichesExplorerProps) {
  const initialThemeFiltre: ThemeFiltre =
    initialTheme && themes.some((theme) => theme.slug === initialTheme)
      ? initialTheme
      : "tous";

  const [themeFiltre, setThemeFiltre] =
    React.useState<ThemeFiltre>(initialThemeFiltre);
  const [niveauFiltre, setNiveauFiltre] = React.useState<NiveauFiltre>("tous");
  const [sortKey, setSortKey] = React.useState<SortKey>("recent");
  const [visibleCount, setVisibleCount] = React.useState(PAGE_SIZE);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    setIsLoading(true);
    const timeout = window.setTimeout(
      () => setIsLoading(false),
      SIMULATED_LATENCY_MS,
    );
    return () => window.clearTimeout(timeout);
  }, [themeFiltre, niveauFiltre, sortKey]);

  function updateTheme(value: ThemeFiltre) {
    setThemeFiltre(value);
    setVisibleCount(PAGE_SIZE);
  }

  function updateNiveau(value: NiveauFiltre) {
    setNiveauFiltre(value);
    setVisibleCount(PAGE_SIZE);
  }

  function updateSort(value: SortKey) {
    setSortKey(value);
    setVisibleCount(PAGE_SIZE);
  }

  function resetFiltres() {
    setThemeFiltre("tous");
    setNiveauFiltre("tous");
    setVisibleCount(PAGE_SIZE);
  }

  const filtered = React.useMemo(() => {
    const activeTheme = themes.find((theme) => theme.slug === themeFiltre);

    return questions
      .filter((item) => niveauFiltre === "tous" || item.niveau === niveauFiltre)
      .filter(
        (item) =>
          !activeTheme ||
          activeTheme.categoriesAssociees.includes(item.categorie),
      )
      .sort((a, b) =>
        sortKey === "alphabetique"
          ? a.question.localeCompare(b.question, "fr")
          : b.dateMiseAJour.localeCompare(a.dateMiseAJour),
      );
  }, [themeFiltre, niveauFiltre, sortKey]);

  const visibleItems = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <Section>
      <div className="flex flex-col gap-6">
        <div>
          <Heading as="h2" size="lg">
            Toutes les fiches
          </Heading>
          <Paragraph tone="muted" size="lg" className="mt-4 max-w-2xl">
            L&apos;intégralité de la bibliothèque, triable et filtrable comme un
            vrai centre de documentation.
          </Paragraph>
        </div>

        <FicheFiltersBar
          theme={themeFiltre}
          onThemeChange={updateTheme}
          niveau={niveauFiltre}
          onNiveauChange={updateNiveau}
          sort={sortKey}
          onSortChange={updateSort}
        />

        <div
          role="status"
          aria-live="polite"
          className="border-border bg-card divide-border divide-y rounded-2xl border px-4 sm:px-6"
        >
          {isLoading ? (
            Array.from({ length: PAGE_SIZE }).map((_, index) => (
              <FicheListSkeleton key={index} />
            ))
          ) : visibleItems.length > 0 ? (
            visibleItems.map((item) => (
              <FicheListItem key={item.slug} item={item} />
            ))
          ) : (
            <EmptyState
              icon={FileQuestion}
              title="Aucun résultat"
              description="Aucune fiche ne correspond à ces filtres pour le moment. Essayez d'élargir votre sélection."
              className="border-none bg-transparent"
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
            Charger plus de fiches
          </Button>
        ) : null}
      </div>
    </Section>
  );
}
