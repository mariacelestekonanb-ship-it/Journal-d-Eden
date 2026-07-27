import type { Metadata } from "next";

import { AdminShell } from "@/components/admin/layout/admin-shell";
import { getCurrentAdminUser } from "@/lib/admin/auth";

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
 * Layout de l'espace d'administration (`/admin`). Aucune authentification
 * n'est implémentée : `getCurrentAdminUser` retourne un utilisateur fixe,
 * point d'entrée unique à remplacer par une vraie session plus tard (voir
 * `lib/admin/auth.ts`). Le site public garde son propre habillage — voir
 * `components/layout/site-chrome.tsx`, qui s'efface sur ces routes.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentAdminUser();

  return <AdminShell user={user}>{children}</AdminShell>;
}
