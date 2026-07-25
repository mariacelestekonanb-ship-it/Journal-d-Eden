"use client";

import * as React from "react";
import { Newspaper } from "lucide-react";

import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  AnalysisFiltersBar,
  type SortKey,
  type ThemeFiltre,
  type TypeFiltre,
} from "@/components/veille/analysis-filters-bar";
import { AnalysisCard } from "@/components/veille/analysis-card";
import { AnalysisCardSkeleton } from "@/components/veille/analysis-card-skeleton";
import { veilleItems } from "@/data/veille";
import { themes } from "@/data/themes";

const PAGE_SIZE = 6;
const SIMULATED_LATENCY_MS = 320;

export interface RecentAnalysesExplorerProps {
  initialDomaine?: string;
}

/**
 * Liste « Analyses récentes » : filtres (domaine, type), tri chronologique
 * et chargement progressif. Les données viennent de `data/veille.ts` ;
 * brancher une base de données ou un CMS headless revient à remplacer ce
 * tableau par un appel réseau retournant la même forme (voir
 * `ContentErrorState`, déjà prêt pour ce cas).
 */
export function RecentAnalysesExplorer({
  initialDomaine,
}: RecentAnalysesExplorerProps) {
  const initialDomaineFiltre: ThemeFiltre =
    initialDomaine && themes.some((theme) => theme.slug === initialDomaine)
      ? initialDomaine
      : "tous";

  const [domaineFiltre, setDomaineFiltre] =
    React.useState<ThemeFiltre>(initialDomaineFiltre);
  const [typeFiltre, setTypeFiltre] = React.useState<TypeFiltre>("tous");
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
  }, [domaineFiltre, typeFiltre, sortKey]);

  function updateDomaine(value: ThemeFiltre) {
    setDomaineFiltre(value);
    setVisibleCount(PAGE_SIZE);
  }

  function updateType(value: TypeFiltre) {
    setTypeFiltre(value);
    setVisibleCount(PAGE_SIZE);
  }

  function updateSort(value: SortKey) {
    setSortKey(value);
    setVisibleCount(PAGE_SIZE);
  }

  function resetFiltres() {
    setDomaineFiltre("tous");
    setTypeFiltre("tous");
    setVisibleCount(PAGE_SIZE);
  }

  const filtered = React.useMemo(() => {
    const activeTheme = themes.find((theme) => theme.slug === domaineFiltre);

    return veilleItems
      .filter((item) => typeFiltre === "tous" || item.type === typeFiltre)
      .filter(
        (item) =>
          !activeTheme ||
          activeTheme.categoriesAssociees.includes(item.categorie),
      )
      .sort((a, b) =>
        sortKey === "ancien"
          ? a.date.localeCompare(b.date)
          : b.date.localeCompare(a.date),
      );
  }, [domaineFiltre, typeFiltre, sortKey]);

  const visibleItems = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Heading as="h2" size="lg">
          Analyses récentes
        </Heading>
        <Paragraph tone="muted" size="lg" className="mt-4 max-w-2xl">
          Chaque publication explique ce qui s&apos;est passé, pourquoi
          c&apos;est important et quelles en sont les conséquences juridiques.
        </Paragraph>
      </div>

      <AnalysisFiltersBar
        domaine={domaineFiltre}
        onDomaineChange={updateDomaine}
        type={typeFiltre}
        onTypeChange={updateType}
        sort={sortKey}
        onSortChange={updateSort}
      />

      <div role="status" aria-live="polite">
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: PAGE_SIZE }).map((_, index) => (
              <AnalysisCardSkeleton key={index} />
            ))}
          </div>
        ) : visibleItems.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleItems.map((item) => (
              <AnalysisCard key={item.slug} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Newspaper}
            title="Aucune analyse"
            description="Aucune analyse ne correspond à ces filtres pour le moment. Essayez d'élargir votre sélection."
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
          Charger plus d&apos;analyses
        </Button>
      ) : null}
    </div>
  );
}
