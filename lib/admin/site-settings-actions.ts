"use server";

import { revalidatePath } from "next/cache";

import { siteSettingsStore } from "@/lib/admin/repository";
import { logActivity } from "@/lib/admin/activity-log";
import { getCurrentAdminUser } from "@/lib/admin/auth";
import type { SiteSettings } from "@/lib/admin/types";

/** Routes publiques dont le rendu dépend des réglages du site — revalidées ensemble à chaque enregistrement plutôt qu'au cas par cas, puisqu'un seul objet de réglages peut affecter plusieurs pages à la fois. */
function revalidateSiteSettings() {
  revalidatePath("/admin/reglages");
  revalidatePath("/", "layout");
}

/** Enregistre les réglages du site — un seul objet, pas de création/suppression. */
export async function saveSiteSettings(
  patch: Partial<SiteSettings>,
): Promise<SiteSettings> {
  const user = await getCurrentAdminUser();

  const updated = await siteSettingsStore.update({
    ...patch,
    updatedAt: new Date().toISOString().slice(0, 10),
    updatedBy: user.nom,
  });

  revalidateSiteSettings();
  await logActivity({
    auteur: user.nom,
    action: "a modifié",
    entityType: "parametres",
    titre: "les réglages du site",
    href: "/admin/reglages",
  });

  return updated;
}
