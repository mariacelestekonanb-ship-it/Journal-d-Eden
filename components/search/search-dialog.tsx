"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { X } from "lucide-react";

import { SearchInput } from "@/components/search/search-input";
import { SearchSection } from "@/components/search/search-section";
import { RecentSearches } from "@/components/search/recent-searches";
import { PopularSearches } from "@/components/search/popular-searches";
import { EmptySearchState } from "@/components/search/empty-search-state";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useRecentSearches } from "@/hooks/use-recent-searches";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import {
  searchProvider,
  RECHERCHES_POPULAIRES,
  type SearchResultItem,
  type SearchResultType,
} from "@/lib/search";

export interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SECTIONS: { type: SearchResultType; titre: string }[] = [
  { type: "fiche", titre: "Comprendre" },
  { type: "analyse", titre: "Veille juridique" },
  { type: "glossaire", titre: "Glossaire" },
  { type: "ressource", titre: "Ressources" },
];

const DEBOUNCE_MS = 200;

/**
 * Modale de la recherche globale : champ premium, historique et suggestions
 * à vide, résultats groupés par catégorie une fois une requête saisie,
 * navigation clavier complète (voir `handleInputKeyDown`). Interface
 * volontairement identique quel que soit le moteur qui répond derrière
 * `searchProvider` (voir `lib/search.ts`).
 */
export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const prefersReducedMotion = usePrefersReducedMotion();
  const { recent, addRecent, removeRecent, clearRecent } = useRecentSearches();

  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebouncedValue(query, DEBOUNCE_MS);
  const [results, setResults] = React.useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);

  // Ferme la modale dès qu'une navigation se produit (résultat cliqué, lien
  // de l'état vide, ou navigateur/historique) plutôt que de dupliquer la
  // fermeture sur chaque point de sortie possible.
  React.useEffect(() => {
    onOpenChange(false);
  }, [pathname, onOpenChange]);

  React.useEffect(() => {
    if (open) return;
    setQuery("");
    setResults([]);
    setActiveIndex(0);
  }, [open]);

  React.useEffect(() => {
    const trimmed = debouncedQuery.trim();

    if (trimmed.length === 0) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    let cancelled = false;
    setIsSearching(true);

    Promise.resolve(searchProvider.search(trimmed)).then((items) => {
      if (cancelled) return;
      setResults(items);
      setIsSearching(false);
      setActiveIndex(0);
    });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  const sections = SECTIONS.map((section) => ({
    ...section,
    items: results.filter((item) => item.type === section.type),
  })).filter((section) => section.items.length > 0);

  const flatResults = sections.flatMap((section) => section.items);
  const hasQuery = query.trim().length > 0;
  const showEmptyState =
    hasQuery &&
    !isSearching &&
    debouncedQuery.trim().length > 0 &&
    flatResults.length === 0;

  function handleClose() {
    onOpenChange(false);
  }

  function handleNavigate(item: SearchResultItem) {
    if (query.trim().length > 0) addRecent(query);
    handleClose();

    if (item.external) {
      window.open(item.href, "_blank", "noopener,noreferrer");
    } else {
      router.push(item.href);
    }
  }

  function handleHover(item: SearchResultItem) {
    const index = flatResults.findIndex((result) => result.id === item.id);
    if (index >= 0) setActiveIndex(index);
  }

  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (flatResults.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % flatResults.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex(
        (index) => (index - 1 + flatResults.length) % flatResults.length,
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      const active = flatResults[activeIndex];
      if (active) handleNavigate(active);
    }
  }

  const activeId = flatResults[activeIndex]?.id ?? null;
  const contentTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.18, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="bg-navy-950/50 fixed inset-0 z-50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.15 }}
              />
            </Dialog.Overlay>

            <Dialog.Content asChild forceMount>
              <motion.div
                className="border-border bg-card fixed top-24 left-1/2 z-50 flex max-h-[min(32rem,70vh)] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 flex-col overflow-hidden rounded-xl border shadow-xl sm:top-28"
                initial={{ opacity: 0, scale: 0.96, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: -4 }}
                transition={contentTransition}
                onKeyDown={(event) => {
                  // Rappel filet : si la frappe a lieu ailleurs que dans
                  // l'input (ex. bouton « Effacer l'historique » ciblé au
                  // clavier), les flèches et Entrée ne doivent rien faire —
                  // seul l'input pilote la navigation virtuelle.
                  if (
                    (event.target as HTMLElement).tagName !== "INPUT" &&
                    (event.key === "ArrowDown" || event.key === "ArrowUp")
                  ) {
                    event.preventDefault();
                  }
                }}
              >
                <Dialog.Title className="sr-only">
                  Rechercher sur LexWatch
                </Dialog.Title>
                <Dialog.Description className="sr-only">
                  Rechercher une notion, une analyse, un terme ou une ressource
                  sur LexWatch.
                </Dialog.Description>

                <div className="flex items-center gap-2 border-b border-transparent p-2">
                  <SearchInput
                    id="global-search-input"
                    value={query}
                    onValueChange={setQuery}
                    onClear={() => setQuery("")}
                    isLoading={isSearching}
                    onKeyDown={handleInputKeyDown}
                    placeholder="Rechercher une notion, une analyse, un terme ou une ressource…"
                    role="combobox"
                    aria-expanded={flatResults.length > 0}
                    aria-controls="global-search-listbox"
                    aria-activedescendant={activeId ?? undefined}
                    aria-autocomplete="list"
                    autoFocus
                  />
                  <Dialog.Close className="text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:ring-ring flex size-11 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none">
                    <X className="size-4.5" />
                    <span className="sr-only">Fermer la recherche</span>
                  </Dialog.Close>
                </div>

                <div
                  id="global-search-listbox"
                  role="listbox"
                  aria-label="Résultats de recherche"
                  className="min-h-0 flex-1 overflow-y-auto p-2"
                >
                  {!hasQuery ? (
                    <div className="space-y-1">
                      <RecentSearches
                        items={recent}
                        onSelect={setQuery}
                        onRemove={removeRecent}
                        onClear={clearRecent}
                      />
                      <PopularSearches
                        items={RECHERCHES_POPULAIRES}
                        onSelect={setQuery}
                      />
                    </div>
                  ) : showEmptyState ? (
                    <EmptySearchState
                      query={debouncedQuery.trim()}
                      onNavigate={handleClose}
                    />
                  ) : (
                    <div className="space-y-4">
                      {sections.map((section) => (
                        <SearchSection
                          key={section.type}
                          type={section.type}
                          titre={section.titre}
                          items={section.items}
                          activeId={activeId}
                          onNavigate={handleNavigate}
                          onHover={handleHover}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-border text-muted-foreground hidden items-center gap-4 border-t px-4 py-2.5 text-xs sm:flex">
                  <span className="flex items-center gap-1.5">
                    <kbd className="bg-secondary rounded-md px-1.5 py-0.5 font-sans">
                      ↑
                    </kbd>
                    <kbd className="bg-secondary rounded-md px-1.5 py-0.5 font-sans">
                      ↓
                    </kbd>
                    pour naviguer
                  </span>
                  <span className="flex items-center gap-1.5">
                    <kbd className="bg-secondary rounded-md px-1.5 py-0.5 font-sans">
                      Entrée
                    </kbd>
                    pour ouvrir
                  </span>
                  <span className="flex items-center gap-1.5">
                    <kbd className="bg-secondary rounded-md px-1.5 py-0.5 font-sans">
                      Échap
                    </kbd>
                    pour fermer
                  </span>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}
