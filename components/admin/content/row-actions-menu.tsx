"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Pencil,
  Copy,
  Eye,
  CircleCheck,
  CircleSlash,
  Archive,
  ArchiveRestore,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/admin/content/confirm-dialog";
import {
  setContentStatus,
  duplicateContent,
  deleteContent,
} from "@/lib/admin/actions";
import type { AdminStatus, ListEntityType } from "@/lib/admin/types";

export interface RowActionsMenuProps {
  entity: ListEntityType;
  id: string;
  titre: string;
  status: AdminStatus;
  /** Absent pour les entités sans page de détail dédiée (ex. catégories) — masque « Modifier ». */
  editHref?: string;
  previewHref?: string;
  /** Entrées supplémentaires (ex. « Renommer », « Fusionner ») insérées avant les actions destructrices — voir le module catégories/glossaire. */
  extraItems?: React.ReactNode;
  /** Masque le bouton Publier/Dépublier — non pertinent pour les catégories. */
  hidePublishToggle?: boolean;
  /** Masque le bouton Dupliquer — non pertinent pour les catégories. */
  hideDuplicate?: boolean;
}

/**
 * Actions rapides d'une ligne de contenu : modifier, dupliquer,
 * prévisualiser, publier/dépublier, archiver, supprimer. Un seul composant
 * réutilisé par les cinq modules (fiches, veille, glossaire, ressources,
 * catégories) — seuls `entity`, `id`, `status` et les liens changent.
 */
export function RowActionsMenu({
  entity,
  id,
  titre,
  status,
  editHref,
  previewHref,
  extraItems,
  hidePublishToggle = false,
  hideDuplicate = false,
}: RowActionsMenuProps) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  function handlePublishToggle() {
    startTransition(async () => {
      await setContentStatus(
        entity,
        id,
        status === "publie" ? "brouillon" : "publie",
        titre,
      );
      router.refresh();
    });
  }

  function handleArchiveToggle() {
    startTransition(async () => {
      await setContentStatus(
        entity,
        id,
        status === "archive" ? "brouillon" : "archive",
        titre,
      );
      router.refresh();
    });
  }

  function handleDuplicate() {
    startTransition(async () => {
      await duplicateContent(entity, id, titre);
      router.refresh();
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteContent(entity, id, titre);
      setConfirmOpen(false);
      router.refresh();
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Actions"
            disabled={isPending}
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {editHref ? (
            <DropdownMenuItem asChild>
              <Link href={editHref}>
                <Pencil aria-hidden />
                Modifier
              </Link>
            </DropdownMenuItem>
          ) : null}
          {previewHref ? (
            <DropdownMenuItem asChild>
              <a href={previewHref} target="_blank" rel="noreferrer">
                <Eye aria-hidden />
                Prévisualiser
              </a>
            </DropdownMenuItem>
          ) : null}
          {hideDuplicate ? null : (
            <DropdownMenuItem onSelect={handleDuplicate}>
              <Copy aria-hidden />
              Dupliquer
            </DropdownMenuItem>
          )}
          {extraItems}
          <DropdownMenuSeparator />
          {hidePublishToggle ? null : (
            <DropdownMenuItem onSelect={handlePublishToggle}>
              {status === "publie" ? (
                <>
                  <CircleSlash aria-hidden />
                  Dépublier
                </>
              ) : (
                <>
                  <CircleCheck aria-hidden />
                  Publier
                </>
              )}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onSelect={handleArchiveToggle}>
            {status === "archive" ? (
              <>
                <ArchiveRestore aria-hidden />
                Désarchiver
              </>
            ) : (
              <>
                <Archive aria-hidden />
                Archiver
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="danger"
            onSelect={() => setConfirmOpen(true)}
          >
            <Trash2 aria-hidden />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Supprimer ce contenu ?"
        description="Cette action est immédiate dans cette démonstration : aucune base de données réelle n'est connectée, la suppression n'est donc pas persistée durablement."
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
        isPending={isPending}
      />
    </>
  );
}
