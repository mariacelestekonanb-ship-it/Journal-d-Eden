"use client";

import { ChevronDown, ChevronUp, GripVertical, Plus, Trash2 } from "lucide-react";
import * as React from "react";
import { useFieldArray, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";

import { AppButton } from "@/shared/components/app-button";
import { Input } from "@/shared/ui/input";
import { cn } from "@/shared/lib/utils";

import { getNestedError } from "../utils/get-nested-error";
import type { ReportFormValues } from "../validation/report.schema";

export type BibleReferenceListName =
  | "thanksgiving"
  | "holySpiritInvitation"
  | "closingThanksgiving"
  | `prayerPoints.${number}.references`;

export interface BibleReferenceListFieldProps {
  control: Control<ReportFormValues>;
  register: UseFormRegister<ReportFormValues>;
  errors: FieldErrors<ReportFormValues>;
  name: BibleReferenceListName;
  addLabel?: string;
  emptyHint?: string;
  /** Espacement réduit pour l'usage imbriqué (au sein d'un point de prière). */
  compact?: boolean;
}

function createReferenceId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `ref-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/**
 * Liste réordonnable de références bibliques — réutilisée pour « Actions de
 * grâce », « Invitation du Saint-Esprit », « Fin / Actions de grâce » et,
 * imbriquée, pour les références de chaque point de prière. Réordonnable à
 * la fois par glisser-déposer (souris) et par boutons haut/bas (clavier).
 */
export function BibleReferenceListField({
  control,
  register,
  errors,
  name,
  addLabel = "Ajouter un verset",
  emptyHint = "Aucune référence pour le moment.",
  compact = false,
}: BibleReferenceListFieldProps) {
  const { fields, append, remove, move } = useFieldArray({ control, name, keyName: "key" });
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);

  function handleDrop(targetIndex: number) {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      return;
    }
    move(dragIndex, targetIndex);
    setDragIndex(null);
  }

  return (
    <div className={cn("space-y-2", compact && "space-y-1.5")}>
      {fields.length === 0 && <p className="text-xs text-muted-foreground">{emptyHint}</p>}

      <ul className="space-y-2">
        {fields.map((field, index) => {
          const errorMessage = getNestedError(errors, `${name}.${index}.reference`);
          return (
            <li
              key={field.key}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => handleDrop(index)}
              onDragEnd={() => setDragIndex(null)}
              className={cn(
                "flex items-start gap-2 rounded-lg border border-transparent transition-colors",
                dragIndex === index && "border-border bg-muted/40",
              )}
            >
              <span
                className="mt-2 flex size-6 shrink-0 cursor-grab items-center justify-center text-muted-foreground"
                aria-hidden="true"
              >
                <GripVertical className="size-4" />
              </span>

              <div className="flex-1 space-y-1">
                <Input
                  aria-label={`Référence biblique ${index + 1}`}
                  aria-invalid={!!errorMessage}
                  placeholder="Ex. Psaume 100:4"
                  {...register(`${name}.${index}.reference` as const)}
                />
                {errorMessage && <p className="text-xs text-destructive">{errorMessage}</p>}
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <AppButton
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={index === 0}
                  aria-label="Monter la référence"
                  onClick={() => move(index, index - 1)}
                >
                  <ChevronUp className="size-4" />
                </AppButton>
                <AppButton
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={index === fields.length - 1}
                  aria-label="Descendre la référence"
                  onClick={() => move(index, index + 1)}
                >
                  <ChevronDown className="size-4" />
                </AppButton>
                <AppButton
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Supprimer la référence"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="size-4 text-destructive" />
                </AppButton>
              </div>
            </li>
          );
        })}
      </ul>

      <AppButton
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ id: createReferenceId(), reference: "" })}
      >
        <Plus className="size-4" />
        {addLabel}
      </AppButton>
    </div>
  );
}
