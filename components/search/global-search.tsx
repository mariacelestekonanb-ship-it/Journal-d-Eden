"use client";

import * as React from "react";
import dynamic from "next/dynamic";

export interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchDialog = dynamic(() =>
  import("@/components/search/search-dialog").then((mod) => mod.SearchDialog),
);

let preloadStarted = false;

/**
 * Précharge le chunk de la modale sans l'afficher — appelée dès qu'un
 * signal d'intention arrive (survol ou focus du déclencheur dans le
 * Header), pour que l'ouverture proprement dite (clic ou Ctrl/Cmd+K) soit
 * instantanée. Idempotente : le navigateur met de toute façon en cache le
 * module après le premier appel, `preloadStarted` évite juste l'import
 * redondant.
 */
export function preloadSearchDialog() {
  if (preloadStarted) return;
  preloadStarted = true;
  void import("@/components/search/search-dialog");
}

/**
 * Point d'entrée unique de la recherche globale : enregistre le raccourci
 * clavier Ctrl/Cmd+K (actif sur toutes les pages, monté une fois dans le
 * Header) et charge la modale à la demande (`next/dynamic`) plutôt que de
 * l'inclure dans le bundle initial du Header, présent sur chaque page.
 */
export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const isShortcut =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      if (!isShortcut) return;

      event.preventDefault();
      preloadSearchDialog();
      onOpenChange(true);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onOpenChange]);

  return <SearchDialog open={open} onOpenChange={onOpenChange} />;
}
