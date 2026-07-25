"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Search, X } from "lucide-react";

import { SearchInput } from "@/components/ui/search-input";
import { EmptyState } from "@/components/ui/empty-state";

export interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Recherche globale, ouverte depuis le Header (bouton desktop ou raccourci).
 * Le résultat est pour l'instant un `EmptyState` : la connexion à un index
 * de contenu réel (Comprendre, Veille, Glossaire…) arrivera avec les pages
 * métier.
 */
export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = React.useState("");

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-navy-950/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 backdrop-blur-sm" />
        <Dialog.Content
          className="border-border bg-card data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-24 left-1/2 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 rounded-2xl border p-4 shadow-xl"
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            document.getElementById("global-search-input")?.focus();
          }}
        >
          <Dialog.Title className="sr-only">
            Rechercher sur LexWatch
          </Dialog.Title>
          <Dialog.Description className="sr-only">
            Rechercher une notion, une actualité ou une ressource sur LexWatch.
          </Dialog.Description>

          <div className="flex items-center gap-3">
            <SearchInput
              id="global-search-input"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher une notion, une actualité…"
              containerClassName="flex-1"
            />
            <Dialog.Close className="text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:ring-ring flex size-11 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none">
              <X className="size-4.5" />
              <span className="sr-only">Fermer la recherche</span>
            </Dialog.Close>
          </div>

          <div className="mt-4">
            <EmptyState
              icon={Search}
              title="La recherche arrive bientôt"
              description="Cette fonctionnalité sera connectée à l'ensemble des contenus LexWatch."
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
