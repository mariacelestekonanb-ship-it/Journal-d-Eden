"use server";

import { revalidatePath } from "next/cache";

import { ressourcesRepository } from "@/lib/admin/repository";
import { logActivity } from "@/lib/admin/activity-log";
import { getCurrentAdminUser } from "@/lib/admin/auth";
import type { AdminStatus } from "@/lib/admin/types";
import type { Domaine } from "@/types";

export interface RessourceFormInput {
  /** Absent = création. */
  id?: string;
  titre: string;
  description: string;
  type: "Texte officiel" | "Rapport" | "Guide" | "Publication";
  domaine: Domaine;
  url: string;
  organisme: string;
  status: AdminStatus;
}

function revalidateRessources(id?: string) {
  revalidatePath("/admin/ressources");
  if (id) revalidatePath(`/admin/ressources/${id}`);
  revalidatePath("/admin");
}

/** Crée ou met à jour une ressource — même structure que `saveFiche` (voir `lib/admin/fiches-actions.ts`). */
export async function saveRessource(
  input: RessourceFormInput,
): Promise<{ id: string }> {
  const user = await getCurrentAdminUser();
  const { id: existingId, ...contenu } = input;

  if (!existingId) {
    const id = `ressource-${Date.now().toString(36)}`;
    const created = await ressourcesRepository.create({
      ...contenu,
      id,
      updatedAt: new Date().toISOString().slice(0, 10),
      updatedBy: user.nom,
      versions: [],
    });
    revalidateRessources(created.id);
    await logActivity({
      auteur: user.nom,
      action: "a créé",
      entityType: "ressource",
      titre: created.titre,
      href: `/admin/ressources/${created.id}`,
    });
    return { id: created.id };
  }

  await ressourcesRepository.update(existingId, {
    ...contenu,
    updatedAt: new Date().toISOString().slice(0, 10),
    updatedBy: user.nom,
  });
  revalidateRessources(existingId);
  await logActivity({
    auteur: user.nom,
    action: "a modifié",
    entityType: "ressource",
    titre: contenu.titre,
    href: `/admin/ressources/${existingId}`,
  });

  return { id: existingId };
}
