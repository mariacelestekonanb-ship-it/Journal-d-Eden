"use server";

import { revalidatePath } from "next/cache";

import {
  analysesRepository,
  categoriesRepository,
  fichesRepository,
  glossaireRepository,
  ressourcesRepository,
  type Repository,
} from "@/lib/admin/repository";
import { ENTITY_PATHS } from "@/lib/admin/content";
import { logActivity } from "@/lib/admin/activity-log";
import { getCurrentAdminUser } from "@/lib/admin/auth";
import type { AdminMeta, AdminStatus, ListEntityType } from "@/lib/admin/types";

const REPOSITORIES = {
  fiche: fichesRepository,
  analyse: analysesRepository,
  glossaire: glossaireRepository,
  ressource: ressourcesRepository,
  categorie: categoriesRepository,
} as const;

const STATUS_ACTION_LABELS: Record<AdminStatus, string> = {
  brouillon: "a remis en brouillon",
  "en-relecture": "a envoyé en relecture",
  "a-corriger": "a demandé une correction sur",
  publie: "a publié",
  archive: "a archivé",
};

/**
 * Les cinq dépôts sont chacun typés sur leur propre contenu (`FicheAdmin`,
 * `AnalyseAdmin`…) ; les actions génériques ci-dessous ne touchent qu'aux
 * champs communs d'`AdminMeta` (statut, date, versions), d'où ce passage
 * par un dépôt vu à travers cette seule interface commune.
 */
function repositoryFor(entity: ListEntityType): Repository<AdminMeta> {
  return REPOSITORIES[entity] as unknown as Repository<AdminMeta>;
}

function revalidateEntity(entity: ListEntityType, id?: string) {
  revalidatePath(`/admin/${ENTITY_PATHS[entity]}`);
  if (id) revalidatePath(`/admin/${ENTITY_PATHS[entity]}/${id}`);
  revalidatePath("/admin");
}

/** Publier, dépublier, envoyer en relecture, marquer à corriger ou archiver — un seul point d'entrée pour tout changement de statut. */
export async function setContentStatus(
  entity: ListEntityType,
  id: string,
  status: AdminStatus,
  titre?: string,
) {
  await repositoryFor(entity).update(id, {
    status,
    updatedAt: new Date().toISOString().slice(0, 10),
  });
  revalidateEntity(entity, id);

  const user = await getCurrentAdminUser();
  await logActivity({
    auteur: user.nom,
    action: STATUS_ACTION_LABELS[status],
    entityType: entity,
    titre: titre ?? id,
    href: `/admin/${ENTITY_PATHS[entity]}/${id}`,
  });
}

export async function duplicateContent(
  entity: ListEntityType,
  id: string,
  titre?: string,
): Promise<string | undefined> {
  const copy = await repositoryFor(entity).duplicate(id);
  revalidateEntity(entity);

  if (copy) {
    const user = await getCurrentAdminUser();
    await logActivity({
      auteur: user.nom,
      action: "a dupliqué",
      entityType: entity,
      titre: titre ?? id,
      href: `/admin/${ENTITY_PATHS[entity]}/${copy.id}`,
    });
  }

  return copy?.id;
}

export async function deleteContent(
  entity: ListEntityType,
  id: string,
  titre?: string,
) {
  await repositoryFor(entity).remove(id);
  revalidateEntity(entity);

  const user = await getCurrentAdminUser();
  await logActivity({
    auteur: user.nom,
    action: "a supprimé",
    entityType: entity,
    titre: titre ?? id,
    href: `/admin/${ENTITY_PATHS[entity]}`,
  });
}
