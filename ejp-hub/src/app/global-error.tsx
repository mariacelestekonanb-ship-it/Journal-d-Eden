"use client";

import * as React from "react";

import "@/styles/globals.css";

export interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Dernier filet : capte une exception levée dans le layout racine lui-même
 * (avant même que l'AppShell ne puisse s'afficher). Doit fournir son propre
 * <html>/<body> — il remplace entièrement `app/layout.tsx` le temps de
 * l'erreur.
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  React.useEffect(() => {
    console.error("Erreur critique au niveau racine :", error);
  }, [error]);

  return (
    <html lang="fr">
      <body className="antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Une erreur critique est survenue</h1>
          <p className="max-w-sm text-sm text-muted-foreground">
            L&apos;application n&apos;a pas pu démarrer correctement. Réessayez, ou revenez plus tard si le problème persiste.
          </p>
          <button
            type="button"
            onClick={reset}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}
