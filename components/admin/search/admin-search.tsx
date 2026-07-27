"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

import { SearchInput } from "@/components/search/search-input";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/admin/content/status-badge";
import { useDisclosure } from "@/hooks/use-disclosure";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { searchAdminContent, type AdminSearchResult } from "@/lib/admin/search";
import { ENTITY_ICONS, ENTITY_LABELS } from "@/lib/admin/content";
import { Button } from "@/components/ui/button";

/**
 * Recherche globale du back-office : ouverte depuis la barre supérieure,
 * interroge `searchAdminContent` (Server Action) — les cinq modules à la
 * fois, brouillons et archives compris, contrairement à la recherche
 * publique.
 */
export function AdminSearch() {
  const disclosure = useDisclosure();
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebouncedValue(query, 200);
  const [results, setResults] = React.useState<AdminSearchResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (!disclosure.isOpen) {
      setQuery("");
      setResults([]);
    }
  }, [disclosure.isOpen]);

  React.useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (trimmed.length === 0) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    searchAdminContent(trimmed).then((items) => {
      if (!cancelled) {
        setResults(items);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  function handleNavigate(href: string) {
    disclosure.close();
    router.push(href);
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="text-muted-foreground gap-2"
        onClick={disclosure.open}
      >
        Rechercher dans l&apos;admin…
      </Button>

      <Dialog.Root open={disclosure.isOpen} onOpenChange={disclosure.setIsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-navy-950/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 backdrop-blur-sm" />
          <Dialog.Content className="border-border bg-card data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-24 left-1/2 z-50 flex max-h-[min(28rem,70vh)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 flex-col overflow-hidden rounded-2xl border shadow-xl">
            <Dialog.Title className="sr-only">
              Recherche globale de l&apos;admin
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              Rechercher une fiche, une analyse, un terme, une ressource ou une
              catégorie, quel que soit son statut.
            </Dialog.Description>

            <div className="flex items-center gap-2 p-2">
              <SearchInput
                value={query}
                onValueChange={setQuery}
                onClear={() => setQuery("")}
                isLoading={isLoading}
                placeholder="Rechercher dans tout le contenu…"
                autoFocus
              />
              <Dialog.Close className="text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:ring-ring flex size-11 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none">
                <X className="size-4.5" />
                <span className="sr-only">Fermer la recherche</span>
              </Dialog.Close>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-2">
              {query.trim().length === 0 ? (
                <EmptyState
                  title="Recherchez dans tout l'admin"
                  description="Fiches, analyses, termes, ressources et catégories — tous statuts confondus."
                  className="border-none bg-transparent py-10"
                />
              ) : results.length === 0 && !isLoading ? (
                <EmptyState
                  title="Aucun résultat"
                  description={`Aucun contenu ne correspond à « ${query} ».`}
                  className="border-none bg-transparent py-10"
                />
              ) : (
                <ul className="space-y-0.5">
                  {results.map((result) => {
                    const Icon = ENTITY_ICONS[result.entity];
                    return (
                      <li key={`${result.entity}-${result.id}`}>
                        <button
                          type="button"
                          onClick={() => handleNavigate(result.href)}
                          className="hover:bg-secondary focus-visible:ring-ring flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none"
                        >
                          <span
                            aria-hidden
                            className="bg-secondary text-navy-900 flex size-8 shrink-0 items-center justify-center rounded-full"
                          >
                            <Icon className="size-4" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="text-foreground block truncate text-sm font-medium">
                              {result.titre}
                            </span>
                            <span className="text-muted-foreground text-xs">
                              {ENTITY_LABELS[result.entity]}
                            </span>
                          </span>
                          <StatusBadge status={result.status} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
