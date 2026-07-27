"use client";

import * as React from "react";

const PREFIX = "lexwatch:admin:autosave:";

export interface UseAutosaveResult {
  /** Heure de la dernière sauvegarde automatique, `null` avant la première. */
  lastSavedAt: Date | null;
}

/**
 * Sauvegarde automatique de la STRUCTURE du formulaire en cours d'édition
 * — un debounce qui écrit `value` en `localStorage`, pas une vraie
 * persistance côté serveur (aucun brouillon n'est aujourd'hui rechargé au
 * revenu sur la page). C'est le point d'intégration prêt pour une vraie
 * sauvegarde de brouillon (`PATCH /api/.../brouillon`) le jour où un
 * backend existe : remplacer l'écriture `localStorage` ci-dessous par
 * l'appel réseau, la signature du hook ne change pas.
 */
export function useAutosave<T>(
  key: string,
  value: T,
  delayMs = 1500,
): UseAutosaveResult {
  const [lastSavedAt, setLastSavedAt] = React.useState<Date | null>(null);
  const skipNext = React.useRef(true);

  React.useEffect(() => {
    if (skipNext.current) {
      skipNext.current = false;
      return;
    }

    const timeout = window.setTimeout(() => {
      try {
        window.localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
        setLastSavedAt(new Date());
      } catch {
        // Stockage indisponible (navigation privée, quota) : sans
        // conséquence, l'autosave n'est qu'une commodité.
      }
    }, delayMs);

    return () => window.clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `value` est volontairement sérialisé pour la comparaison de dépendances, une référence identique à chaque rendu casserait le debounce.
  }, [key, JSON.stringify(value), delayMs]);

  return { lastSavedAt };
}
