import Script from "next/script";

import { analyticsConfig } from "@/lib/analytics-config";

/**
 * Points d'intégration analytics, chacun conditionné à sa variable
 * d'environnement : tant qu'elle n'est pas définie, aucun script n'est
 * chargé et ce composant ne rend rien. Aucune intégration réelle n'est
 * activée dans ce dépôt — seule l'architecture prête à accueillir Google
 * Analytics, Microsoft Clarity et Plausible est livrée ici (Google Search
 * Console est couvert à part, via `verification` dans `RootLayout`).
 * `strategy="afterInteractive"` charge chaque script après l'hydratation,
 * pour ne jamais retarder le rendu ou la mise en interactivité de la page.
 */
export function AnalyticsScripts() {
  return (
    <>
      {analyticsConfig.googleAnalyticsId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${analyticsConfig.googleAnalyticsId}');
            `}
          </Script>
        </>
      ) : null}

      {analyticsConfig.clarityProjectId ? (
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${analyticsConfig.clarityProjectId}");
          `}
        </Script>
      ) : null}

      {analyticsConfig.plausibleDomain ? (
        <Script
          src="https://plausible.io/js/script.js"
          data-domain={analyticsConfig.plausibleDomain}
          strategy="afterInteractive"
        />
      ) : null}
    </>
  );
}
