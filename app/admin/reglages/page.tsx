import type { Metadata } from "next";

import { siteSettingsStore } from "@/lib/admin/repository";
import { ReglagesForm } from "@/app/admin/reglages/reglages-form";

export const metadata: Metadata = { title: "Réglages" };

/**
 * Page unique des réglages du site — pas de route `[id]` : il n'existe
 * qu'un seul objet `SiteSettings` (voir `createSingletonStore` dans
 * `lib/admin/repository.ts`), à la différence des modules Fiches/Veille/
 * Glossaire/Ressources qui gèrent des listes.
 */
export default async function ReglagesPage() {
  const settings = await siteSettingsStore.get();

  return <ReglagesForm settings={settings} />;
}
