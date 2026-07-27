"use server";

import { revalidatePath } from "next/cache";

import { analysesRepository } from "@/lib/admin/repository";
import { logActivity } from "@/lib/admin/activity-log";
import { getCurrentAdminUser } from "@/lib/admin/auth";
import { slugifyTerme } from "@/lib/format";
import type { AdminStatus } from "@/lib/admin/types";
import type {
  ContentBlock,
  Domaine,
  EvenementChronologie,
  ImpactAnalyse,
  ReferenceJuridique,
  ReferenceOfficielle,
  TypeVeille,
} from "@/types";

export interface AnalyseFormInput {
  /** Absent = création. */
  id?: string;
  slug: string;
  titre: string;
  resume: string;
  pointsCles: string[];
  domaine: Domaine;
  categorie: string;
  type: TypeVeille;
  date: string;
  dateMiseAJour: string;
  source: string;
  tempsLecture: number;
  aLaUne?: boolean;
  chronologie: EvenementChronologie[];
  contexteJuridique: ReferenceJuridique[];
  analyse: ContentBlock[];
  impact: ImpactAnalyse;
  referencesOfficielles: ReferenceOfficielle[];
  status: AdminStatus;
}

function revalidateVeille(id?: string) {
  revalidatePath("/admin/veille");
  if (id) revalidatePath(`/admin/veille/${id}`);
  revalidatePath("/admin");
}

/**
 * Crée ou met à jour une analyse de veille — même structure que
 * `saveFiche` (voir `lib/admin/fiches-actions.ts`), adaptée aux champs
 * propres à `VeilleItem` (chronologie, contexte juridique, impact,
 * références officielles).
 */
export async function saveAnalyse(
  input: AnalyseFormInput,
): Promise<{ id: string }> {
  const user = await getCurrentAdminUser();
  const { id: existingId, ...contenu } = input;

  if (!existingId) {
    const id = contenu.slug || slugifyTerme(contenu.titre);
    const created = await analysesRepository.create({
      ...contenu,
      id,
      slug: id,
      updatedAt: new Date().toISOString().slice(0, 10),
      updatedBy: user.nom,
      versions: [],
    });
    revalidateVeille(created.id);
    await logActivity({
      auteur: user.nom,
      action: "a créé",
      entityType: "analyse",
      titre: created.titre,
      href: `/admin/veille/${created.id}`,
    });
    return { id: created.id };
  }

  await analysesRepository.update(existingId, {
    ...contenu,
    updatedAt: new Date().toISOString().slice(0, 10),
    updatedBy: user.nom,
  });
  revalidateVeille(existingId);
  await logActivity({
    auteur: user.nom,
    action: "a modifié",
    entityType: "analyse",
    titre: contenu.titre,
    href: `/admin/veille/${existingId}`,
  });

  return { id: existingId };
}
