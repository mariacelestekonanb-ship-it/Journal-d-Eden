"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { Select } from "@/components/ui/select";

export interface MergeOption {
  id: string;
  label: string;
}

export interface MergeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  options: MergeOption[];
  onConfirm: (targetId: string) => void;
  isPending?: boolean;
}

/** Fusion générique : choisir une cible parmi une liste, puis confirmer — utilisé par le glossaire et les catégories. */
export function MergeDialog({
  open,
  onOpenChange,
  title,
  description,
  options,
  onConfirm,
  isPending = false,
}: MergeDialogProps) {
  const [targetId, setTargetId] = React.useState(options[0]?.id ?? "");

  React.useEffect(() => {
    if (open) setTargetId(options[0]?.id ?? "");
  }, [open, options]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-navy-950/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 backdrop-blur-sm" />
        <Dialog.Content className="border-border bg-card data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border p-6 shadow-xl">
          <Dialog.Title asChild>
            <Heading as="h2" size="sm">
              {title}
            </Heading>
          </Dialog.Title>
          <Dialog.Description asChild>
            <Paragraph tone="muted" size="sm" className="mt-2">
              {description}
            </Paragraph>
          </Dialog.Description>
          <div className="mt-4">
            {options.length === 0 ? (
              <Paragraph tone="muted" size="sm">
                Aucune autre entrée disponible pour la fusion.
              </Paragraph>
            ) : (
              <Select
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                aria-label="Fusionner vers"
              >
                {options.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </Select>
            )}
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Dialog.Close asChild>
              <Button variant="outline">Annuler</Button>
            </Dialog.Close>
            <Button
              onClick={() => onConfirm(targetId)}
              disabled={isPending || !targetId}
            >
              Fusionner
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
