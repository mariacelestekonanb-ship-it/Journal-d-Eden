"use server";

import { revalidatePath } from "next/cache";

import { fichesRepository } from "@/lib/admin/repository";
import { logActivity } from "@/lib/admin/activity-log";
import { getCurrentAdminUser } from "@/lib/admin/auth";
import { slugifyTerme } from "@/lib/format";
import type { AdminStatus } from "@/lib/admin/types";
import type {
  ContentBlock,
  Domaine,
  Niveau,
  ReferenceJuridique,
} from "@/types";

export interface FicheFormInput {
  /** Absent = création. */
  id?: string;
  slug: string;
  question: string;
  reponseCourte: string;
  contexte: string[];
  explication: ContentBlock[];
  pointsCles: string[];
  references: ReferenceJuridique[];
  domaine: Domaine;
  categorie: string;
  niveau: Niveau;
  tempsLecture: number;
  dateMiseAJour: string;
  status: AdminStatus;
}

function revalidateFiches(id?: string) {
  revalidatePath("/admin/fiches");
  if (id) revalidatePath(`/admin/fiches/${id}`);
  revalidatePath("/admin");
}

/**
 * Crée ou met à jour une fiche — point d'entrée unique du formulaire
 * `app/admin/fiches/[id]/fiche-form.tsx`. En création, l'identifiant est
 * dérivé de la question (comme le ferait un slug auto-généré côté CMS
 * headless) ; en modification, l'identifiant reste stable.
 */
export async function saveFiche(
  input: FicheFormInput,
): Promise<{ id: string }> {
  const user = await getCurrentAdminUser();
  const { id: existingId, ...contenu } = input;

  if (!existingId) {
    const id = contenu.slug || slugifyTerme(contenu.question);
    const created = await fichesRepository.create({
      ...contenu,
      id,
      slug: id,
      updatedAt: new Date().toISOString().slice(0, 10),
      updatedBy: user.nom,
      versions: [],
    });
    revalidateFiches(created.id);
    await logActivity({
      auteur: user.nom,
      action: "a créé",
      entityType: "fiche",
      titre: created.question,
      href: `/admin/fiches/${created.id}`,
    });
    return { id: created.id };
  }

  await fichesRepository.update(existingId, {
    ...contenu,
    updatedAt: new Date().toISOString().slice(0, 10),
    updatedBy: user.nom,
  });
  revalidateFiches(existingId);
  await logActivity({
    auteur: user.nom,
    action: "a modifié",
    entityType: "fiche",
    titre: contenu.question,
    href: `/admin/fiches/${existingId}`,
  });

  return { id: existingId };
}
