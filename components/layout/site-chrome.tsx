"use client";

import { usePathname } from "next/navigation";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { JsonLd } from "@/components/seo/json-ld";
import { buildOrganizationJsonLd, buildWebSiteJsonLd } from "@/lib/json-ld";
import type { SiteSettings } from "@/lib/admin/types";

export interface SiteChromeProps {
  children: React.ReactNode;
  /** Réglages du site (voir `/admin/reglages`), lus par `RootLayout` (Server Component) et transmis ici puisque `SiteChrome` est un Client Component. */
  settings: SiteSettings;
}

/**
 * Habillage du site public (lien d'évitement, Header, Footer, JSON-LD
 * WebSite/Organization) — absent sur `/admin`, qui a son propre habillage
 * (voir `app/admin/layout.tsx`) et n'a pas vocation à être indexé. Une
 * seule mise en page racine (`app/layout.tsx`) reste ainsi partagée par le
 * site public et l'espace d'administration, sans déplacer les routes
 * publiques existantes dans un groupe de routes dédié.
 */
export function SiteChrome({ children, settings }: SiteChromeProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <JsonLd data={[buildWebSiteJsonLd(), buildOrganizationJsonLd()]} />
      <a
        href="#main-content"
        className="focus:bg-navy-900 sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-white"
      >
        Aller au contenu principal
      </a>
      <Header logoUrl={settings.branding.logoUrl} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer
        logoUrl={settings.branding.logoUrl}
        email={settings.contact.email}
        liensSociaux={settings.contact.liensSociaux}
      />
    </>
  );
}
