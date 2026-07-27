"use server";

import { revalidatePath } from "next/cache";

import { glossaireRepository } from "@/lib/admin/repository";
import { logActivity } from "@/lib/admin/activity-log";
import { getCurrentAdminUser } from "@/lib/admin/auth";
import { slugifyTerme } from "@/lib/format";
import type { AdminStatus, SeoMeta } from "@/lib/admin/types";
import type { ContentBlock, ContenusAssocies } from "@/types";

export interface TermeFormInput {
  /** Absent = création. */
  id?: string;
  terme: string;
  definition: string;
  theme: string;
  explication: ContentBlock[];
  voirAussi: string[];
  fichesAssociees: string[];
  analysesAssociees: string[];
  status: AdminStatus;
  seo?: SeoMeta;
}

function revalidateGlossaire(id?: string) {
  revalidatePath("/admin/glossaire");
  if (id) revalidatePath(`/admin/glossaire/${id}`);
  revalidatePath("/admin");
}

function contenusAssociesDe(
  fiches: string[],
  analyses: string[],
): ContenusAssocies {
  return {
    fiches: fiches.length > 0 ? fiches : undefined,
    analyses: analyses.length > 0 ? analyses : undefined,
  };
}

/** Crée ou met à jour un terme du glossaire. La lettre d'index est dérivée automatiquement du terme. */
export async function saveTerme(
  input: TermeFormInput,
): Promise<{ id: string }> {
  const user = await getCurrentAdminUser();
  const {
    id: existingId,
    fichesAssociees,
    analysesAssociees,
    voirAussi,
    ...rest
  } = input;
  const contenusAssocies = contenusAssociesDe(
    fichesAssociees,
    analysesAssociees,
  );
  const lettre = rest.terme.charAt(0).toUpperCase();
  const voirAussiFiltre = voirAussi.map((v) => v.trim()).filter(Boolean);

  if (!existingId) {
    const id = slugifyTerme(rest.terme);
    const created = await glossaireRepository.create({
      ...rest,
      voirAussi: voirAussiFiltre,
      contenusAssocies,
      lettre,
      id,
      updatedAt: new Date().toISOString().slice(0, 10),
      updatedBy: user.nom,
      versions: [],
    });
    revalidateGlossaire(created.id);
    await logActivity({
      auteur: user.nom,
      action: "a créé",
      entityType: "glossaire",
      titre: created.terme,
      href: `/admin/glossaire/${created.id}`,
    });
    return { id: created.id };
  }

  await glossaireRepository.update(existingId, {
    ...rest,
    voirAussi: voirAussiFiltre,
    contenusAssocies,
    lettre,
    updatedAt: new Date().toISOString().slice(0, 10),
    updatedBy: user.nom,
  });
  revalidateGlossaire(existingId);
  await logActivity({
    auteur: user.nom,
    action: "a modifié",
    entityType: "glossaire",
    titre: rest.terme,
    href: `/admin/glossaire/${existingId}`,
  });

  return { id: existingId };
}

/**
 * Fusionne deux termes : le terme source est supprimé, ses renvois
 * (« voir aussi ») et contenus associés sont reportés sur le terme cible.
 */
export async function mergeTermes(
  sourceId: string,
  targetId: string,
): Promise<void> {
  const [source, target] = await Promise.all([
    glossaireRepository.get(sourceId),
    glossaireRepository.get(targetId),
  ]);
  if (!source || !target || source.id === target.id) return;

  const user = await getCurrentAdminUser();

  const voirAussi = Array.from(
    new Set([
      ...(target.voirAussi ?? []),
      ...(source.voirAussi ?? []),
      source.terme,
    ]),
  );
  const fiches = Array.from(
    new Set([
      ...(target.contenusAssocies?.fiches ?? []),
      ...(source.contenusAssocies?.fiches ?? []),
    ]),
  );
  const analyses = Array.from(
    new Set([
      ...(target.contenusAssocies?.analyses ?? []),
      ...(source.contenusAssocies?.analyses ?? []),
    ]),
  );

  await glossaireRepository.update(targetId, {
    voirAussi,
    contenusAssocies: contenusAssociesDe(fiches, analyses),
    updatedAt: new Date().toISOString().slice(0, 10),
    updatedBy: user.nom,
  });
  await glossaireRepository.remove(sourceId);

  revalidateGlossaire(targetId);
  await logActivity({
    auteur: user.nom,
    action: `a fusionné « ${source.terme} » dans`,
    entityType: "glossaire",
    titre: target.terme,
    href: `/admin/glossaire/${targetId}`,
  });
}
