"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { labelDomaine } from "@/lib/format";
import type { CategorieFormInput } from "@/lib/admin/categories-actions";
import type { Domaine } from "@/types";

export interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  initialValue: CategorieFormInput;
  onSubmit: (value: CategorieFormInput) => void;
  isPending?: boolean;
}

const DOMAINES: Domaine[] = ["droit-spatial", "droit-numerique"];

/** Formulaire de création/renommage d'une catégorie — modale légère, sans page dédiée. */
export function CategoryDialog({
  open,
  onOpenChange,
  title,
  initialValue,
  onSubmit,
  isPending = false,
}: CategoryDialogProps) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    if (open) setValue(initialValue);
  }, [open, initialValue]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-navy-950/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 backdrop-blur-sm" />
        <Dialog.Content className="border-border bg-card data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border p-6 shadow-xl">
          <Dialog.Title asChild>
            <Heading as="h2" size="sm">
              {title}
            </Heading>
          </Dialog.Title>
          <Dialog.Description className="sr-only">
            Titre, description, domaine et icône de la catégorie.
          </Dialog.Description>

          <div className="mt-4 space-y-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="categorie-titre">
                Titre
              </label>
              <Input
                id="categorie-titre"
                value={value.titre}
                onChange={(e) => setValue({ ...value, titre: e.target.value })}
                placeholder="Ex. Traités spatiaux internationaux"
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <label
                className="text-sm font-medium"
                htmlFor="categorie-description"
              >
                Description
              </label>
              <Textarea
                id="categorie-description"
                value={value.description}
                onChange={(e) =>
                  setValue({ ...value, description: e.target.value })
                }
                placeholder="Une phrase de description"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Domaine</label>
                <Select
                  value={value.domaine}
                  onChange={(e) =>
                    setValue({ ...value, domaine: e.target.value as Domaine })
                  }
                >
                  {DOMAINES.map((domaine) => (
                    <option key={domaine} value={domaine}>
                      {labelDomaine(domaine)}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-1.5">
                <label
                  className="text-sm font-medium"
                  htmlFor="categorie-icone"
                >
                  Icône (lucide-react)
                </label>
                <Input
                  id="categorie-icone"
                  value={value.icone}
                  onChange={(e) =>
                    setValue({ ...value, icone: e.target.value })
                  }
                  placeholder="Ex. Rocket"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Dialog.Close asChild>
              <Button variant="outline">Annuler</Button>
            </Dialog.Close>
            <Button
              onClick={() => onSubmit(value)}
              disabled={isPending || value.titre.trim().length === 0}
            >
              Enregistrer
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
