"use client";

import * as React from "react";

/**
 * Retarde la propagation d'une valeur qui change vite (ex. saisie clavier),
 * pour éviter de relancer une recherche à chaque frappe.
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    const timeout = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timeout);
  }, [value, delayMs]);

  return debounced;
}
