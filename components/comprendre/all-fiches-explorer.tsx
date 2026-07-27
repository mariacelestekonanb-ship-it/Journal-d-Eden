"use client";

import * as React from "react";
import { FileQuestion, LibraryBig } from "lucide-react";

import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  FicheFiltersBar,
  type DureeFiltre,
  type NiveauFiltre,
  type SortKey,
  type ThemeFiltre,
} from "@/components/comprendre/fiche-filters-bar";
import { KnowledgeCard } from "@/components/comprendre/knowledge-card";
import { SkeletonCard } from "@/components/comprendre/skeleton-card";
import { questions } from "@/data/questions";
import { themes } from "@/data/themes";

const PAGE_SIZE = 6;
const SIMULATED_LATENCY_MS = 320;

export interface AllFichesExplorerProps {
  initialTheme?: string;
}

/**
 * Simule un compteur de consultations stable (pas de source d'audience
 * réelle branchée) pour le tri « Les plus consultées » — un hash simple du
 * slug plutôt que `Math.random()`, pour rester déterministe entre le rendu
 * serveur et l'hydratation client.
 */
function popularityScore(slug: string): number {
  let hash = 0;
  for (let index = 0; index < slug.length; index += 1) {
    hash = (hash * 31 + slug.charCodeAt(index)) % 1000;
  }
  return hash;
}

function dureeCorrespond(duree: DureeFiltre, tempsLecture: number): boolean {
  if (duree === "tous") return true;
  if (duree === "courte") return tempsLecture <= 5;
  if (duree === "moyenne") return tempsLecture > 5 && tempsLecture <= 10;
  return tempsLecture > 10;
}

/**
 * Bibliothèque complète des fiches : filtres (thème, niveau, durée), tri
 * (récent / alphabétique / plus consultées) et chargement progressif. Les
 * données viennent de `data/questions.ts` ; brancher une base de données
 * revient à remplacer les deux tableaux importés par un appel réseau
 * retournant la même forme (voir aussi `ContentErrorState`, prêt pour ce
 * cas).
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
  const [dureeFiltre, setDureeFiltre] = React.useState<DureeFiltre>("tous");
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
  }, [themeFiltre, niveauFiltre, dureeFiltre, sortKey]);

  function updateTheme(value: ThemeFiltre) {
    setThemeFiltre(value);
    setVisibleCount(PAGE_SIZE);
  }

  function updateNiveau(value: NiveauFiltre) {
    setNiveauFiltre(value);
    setVisibleCount(PAGE_SIZE);
  }

  function updateDuree(value: DureeFiltre) {
    setDureeFiltre(value);
    setVisibleCount(PAGE_SIZE);
  }

  function updateSort(value: SortKey) {
    setSortKey(value);
    setVisibleCount(PAGE_SIZE);
  }

  function resetFiltres() {
    setThemeFiltre("tous");
    setNiveauFiltre("tous");
    setDureeFiltre("tous");
    setVisibleCount(PAGE_SIZE);
  }

  const filtresActifs =
    themeFiltre !== "tous" || niveauFiltre !== "tous" || dureeFiltre !== "tous";

  const filtered = React.useMemo(() => {
    const activeTheme = themes.find((theme) => theme.slug === themeFiltre);

    return questions
      .filter((item) => niveauFiltre === "tous" || item.niveau === niveauFiltre)
      .filter((item) => dureeCorrespond(dureeFiltre, item.tempsLecture))
      .filter(
        (item) =>
          !activeTheme ||
          activeTheme.categoriesAssociees.includes(item.categorie),
      )
      .sort((a, b) => {
        if (sortKey === "alphabetique") {
          return a.question.localeCompare(b.question, "fr");
        }
        if (sortKey === "populaire") {
          return popularityScore(b.slug) - popularityScore(a.slug);
        }
        return b.dateMiseAJour.localeCompare(a.dateMiseAJour);
      });
  }, [themeFiltre, niveauFiltre, dureeFiltre, sortKey]);

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
          duree={dureeFiltre}
          onDureeChange={updateDuree}
          sort={sortKey}
          onSortChange={updateSort}
        />

        <div role="status" aria-live="polite">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: PAGE_SIZE }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : visibleItems.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visibleItems.map((item) => (
                <KnowledgeCard key={item.slug} item={item} />
              ))}
            </div>
          ) : questions.length === 0 ? (
            <EmptyState
              icon={LibraryBig}
              title="La bibliothèque est vide pour le moment"
              description="Aucune fiche n'a encore été publiée. Revenez bientôt."
            />
          ) : (
            <EmptyState
              icon={FileQuestion}
              title="Aucun résultat"
              description="Aucune fiche ne correspond à ces filtres pour le moment. Essayez d'élargir votre sélection."
              action={
                filtresActifs ? (
                  <Button variant="outline" onClick={resetFiltres}>
                    Réinitialiser les filtres
                  </Button>
                ) : undefined
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
