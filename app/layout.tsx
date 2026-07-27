import type { Metadata, Viewport } from "next";
import { Manrope, Inter } from "next/font/google";

import { SiteChrome } from "@/components/layout/site-chrome";
import { AnalyticsScripts } from "@/components/analytics/analytics-scripts";
import { siteConfig, searchConsoleVerification } from "@/lib/site-config";
import { siteSettingsStore } from "@/lib/admin/repository";
import { buildPaletteStyle } from "@/lib/color-palettes";
import "@/styles/globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  manifest: "/manifest.webmanifest",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: siteConfig.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Vide tant que les variables d'environnement correspondantes ne sont pas
  // définies : aucune balise de vérification n'est émise avant que de vraies
  // valeurs existent (voir `lib/site-config.ts`).
  verification: searchConsoleVerification,
};

export const viewport: Viewport = {
  themeColor: "#050b18",
  colorScheme: "light",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await siteSettingsStore.get();

  return (
    <html
      lang="fr"
      className={`${manrope.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground flex min-h-full flex-col font-sans">
        {/* Surcharge la palette de couleurs choisie dans /admin/reglages —
            après l'import de styles/globals.css, donc l'emporte sur les
            variables de couleur qu'elle redéfinit (voir
            lib/color-palettes.ts) sans toucher au reste du thème. */}
        <style
          dangerouslySetInnerHTML={{
            __html: buildPaletteStyle(settings.branding.palette),
          }}
        />
        <SiteChrome settings={settings}>{children}</SiteChrome>
        <AnalyticsScripts />
      </body>
    </html>
  );
}
