"use client";

import * as React from "react";

const STORAGE_KEY = "lexwatch:recherche:historique";
const MAX_ENTRIES = 5;

function readStorage(): string[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as string[]) : [];
  } catch {
    // Stockage indisponible (navigation privée, quota, JSON invalide…) :
    // l'historique reste vide plutôt que de faire planter la recherche.
    return [];
  }
}

/**
 * Historique des recherches, réellement persisté en `localStorage` (pas une
 * donnée fictive) : les dernières requêtes survivent à un rechargement de
 * page, plafonnées à `MAX_ENTRIES` et dédupliquées.
 */
export function useRecentSearches() {
  const [recent, setRecent] = React.useState<string[]>([]);

  React.useEffect(() => {
    setRecent(readStorage());
  }, []);

  const addRecent = React.useCallback((query: string) => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return;

    setRecent((current) => {
      const next = [
        trimmed,
        ...current.filter(
          (item) => item.toLowerCase() !== trimmed.toLowerCase(),
        ),
      ].slice(0, MAX_ENTRIES);

      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Stockage indisponible : l'historique reste en mémoire pour la session en cours.
      }

      return next;
    });
  }, []);

  const removeRecent = React.useCallback((query: string) => {
    setRecent((current) => {
      const next = current.filter((item) => item !== query);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Stockage indisponible : l'historique reste en mémoire pour la session en cours.
      }
      return next;
    });
  }, []);

  const clearRecent = React.useCallback(() => {
    setRecent([]);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Stockage indisponible : rien à nettoyer.
    }
  }, []);

  return { recent, addRecent, removeRecent, clearRecent };
}
