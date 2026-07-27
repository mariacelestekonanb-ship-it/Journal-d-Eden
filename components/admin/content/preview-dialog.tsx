"use client";

import type { ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export interface PreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

/**
 * Coquille d'aperçu avant publication : une fenêtre modale qui rejoue le
 * contenu en cours d'édition avec les mêmes composants publics que le
 * site (`ContentBlocks`, `LegalReference`…), pas une image ou un
 * placeholder — chaque formulaire compose son propre aperçu à l'intérieur
 * (voir `FicheForm`, `AnalyseForm`…), ce composant ne fournit que le
 * cadre commun.
 */
export function PreviewDialog({
  open,
  onOpenChange,
  children,
}: PreviewDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-navy-950/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 backdrop-blur-sm" />
        <Dialog.Content className="border-border bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-1/2 left-1/2 z-50 flex max-h-[85vh] w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border shadow-xl">
          <div className="border-border bg-background sticky top-0 z-10 flex items-center justify-between gap-3 border-b p-4">
            <div className="flex items-center gap-2">
              <Dialog.Title asChild>
                <span className="text-sm font-semibold">
                  Aperçu avant publication
                </span>
              </Dialog.Title>
              <Badge variant="accent">Brouillon</Badge>
            </div>
            <Dialog.Close className="text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:ring-ring flex size-9 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none">
              <X className="size-4" />
              <span className="sr-only">Fermer l&apos;aperçu</span>
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">
            Prévisualisation du contenu tel qu&apos;il apparaîtra une fois
            publié.
          </Dialog.Description>
          <div className="min-h-0 flex-1 overflow-y-auto p-6 sm:p-10">
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
