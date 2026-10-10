import type { Metadata } from "next";

import { AdminShell } from "@/components/admin/layout/admin-shell";
import { getCurrentAdminUser } from "@/lib/admin/auth";
import { siteSettingsStore } from "@/lib/admin/repository";

// L'admin ne doit jamais être indexé — remplace le `robots` du layout
// racine pour tout ce qui vit sous /admin (fusion Next.js par simple
// remplacement de la clé, pas de fusion profonde).
export const metadata: Metadata = {
  title: {
    template: "%s | Administration LexWatch",
    default: "Administration",
  },
  robots: { index: false, follow: false },
};

/**
 * Layout des pages protégées de l'espace d'administration — tout ce qui
 * est sous ce groupe `(dashboard)` exige une session valide, vérifiée en
 * amont par `middleware.ts` (voir `lib/admin/session.ts`), à l'exception
 * de `/admin/login` qui vit hors de ce groupe et n'affiche donc pas cette
 * coquille. `getCurrentAdminUser` retourne en revanche toujours un nom
 * fixe : l'authentification protège l'accès, mais il n'existe qu'un seul
 * compte partagé, pas de vrais comptes individuels (voir
 * `lib/admin/auth.ts`). Le site public garde son propre habillage — voir
 * `components/layout/site-chrome.tsx`, qui s'efface sur ces routes.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, settings] = await Promise.all([
    getCurrentAdminUser(),
    siteSettingsStore.get(),
  ]);

  return (
    <AdminShell user={user} logoUrl={settings.branding.logoUrl}>
      {children}
    </AdminShell>
  );
}
