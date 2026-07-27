"use client";

/**
 * Filet de secours ultime : ne se déclenche que si `app/layout.tsx`
 * lui-même échoue (une erreur dans `RootLayout`, `SiteChrome`, ou le
 * chargement des polices). Remplace alors tout le document — d'où la
 * nécessité d'y redéclarer `<html>`/`<body>`. Volontairement autonome
 * (styles en ligne, aucune dépendance à `styles/globals.css` ni aux
 * composants du design system) : si le layout racine est en cause, mieux
 * vaut ne rien réutiliser qui pourrait être la source du problème.
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          backgroundColor: "#050b18",
          color: "#f7f8fa",
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "28rem" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
            Une erreur inattendue est survenue
          </h1>
          <p style={{ marginTop: "1rem", color: "#9aa2b1", lineHeight: 1.6 }}>
            LexWatch a rencontré un problème imprévu. Vous pouvez réessayer, ou
            revenir à l&apos;accueil.
          </p>
          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              gap: "0.75rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={reset}
              style={{
                borderRadius: "9999px",
                padding: "0.625rem 1.5rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                backgroundColor: "#c9a227",
                color: "#050b18",
                border: "none",
                cursor: "pointer",
              }}
            >
              Réessayer
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- rechargement complet volontaire : si le layout racine a échoué, la navigation côté client de next/link n'est pas fiable ici. */}
            <a
              href="/"
              style={{
                borderRadius: "9999px",
                padding: "0.625rem 1.5rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#f7f8fa",
                border: "1px solid #16294d",
                textDecoration: "none",
              }}
            >
              Retour à l&apos;accueil
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
