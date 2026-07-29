"use client";

import { ChevronDown, ChevronUp, GripVertical, Plus, Trash2 } from "lucide-react";
import * as React from "react";
import { useFieldArray, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";

import { AppButton } from "@/shared/components/app-button";
import { AppCard, AppCardContent } from "@/shared/components/app-card";
import { cn } from "@/shared/lib/utils";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

import { getNestedError } from "../utils/get-nested-error";
import type { ReportFormValues } from "../validation/report.schema";
import { BibleReferenceListField } from "./bible-reference-list-field";

export interface ReportPrayerPointsFieldProps {
  control: Control<ReportFormValues>;
  register: UseFormRegister<ReportFormValues>;
  errors: FieldErrors<ReportFormValues>;
}

function createPointId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `point-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/**
 * Section « Points de prière » — la partie la plus importante du compte
 * rendu : un nombre illimité de points, chacun réordonnable par
 * glisser-déposer (souris) ou par boutons haut/bas (clavier), avec ses
 * propres références bibliques.
 */
export function ReportPrayerPointsField({ control, register, errors }: ReportPrayerPointsFieldProps) {
  const { fields, append, remove, move } = useFieldArray({ control, name: "prayerPoints", keyName: "key" });
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
    <div className="space-y-4">
      {fields.length === 0 && (
        <p className="text-sm text-muted-foreground">Aucun point de prière pour le moment — ajoutez-en au moins un avant de soumettre.</p>
      )}

      <div className="space-y-4">
        {fields.map((field, index) => {
          const titleError = getNestedError(errors, `prayerPoints.${index}.title`);
          return (
            <div
              key={field.key}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => handleDrop(index)}
              onDragEnd={() => setDragIndex(null)}
            >
              <AppCard className={cn("transition-colors", dragIndex === index && "border-primary/50 bg-muted/40")}>
                <AppCardContent className="space-y-3 p-4">
                  <div className="flex items-start gap-2">
                    <span className="mt-2 flex size-6 shrink-0 cursor-grab items-center justify-center text-muted-foreground" aria-hidden="true">
                      <GripVertical className="size-4" />
                    </span>

                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`prayerPoints.${index}.title`}>Point de prière {index + 1}</Label>
                      <Input
                        id={`prayerPoints.${index}.title`}
                        placeholder="Ex. Prions pour que l'EJP soit une église de foi."
                        aria-invalid={!!titleError}
                        {...register(`prayerPoints.${index}.title` as const)}
                      />
                      {titleError && <p className="text-xs text-destructive">{titleError}</p>}
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      <AppButton
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={index === 0}
                        aria-label="Monter le point de prière"
                        onClick={() => move(index, index - 1)}
                      >
                        <ChevronUp className="size-4" />
                      </AppButton>
                      <AppButton
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={index === fields.length - 1}
                        aria-label="Descendre le point de prière"
                        onClick={() => move(index, index + 1)}
                      >
                        <ChevronDown className="size-4" />
                      </AppButton>
                      <AppButton
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Supprimer le point de prière"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </AppButton>
                    </div>
                  </div>

                  <div className="pl-8">
                    <Label className="text-xs text-muted-foreground">Références bibliques du point</Label>
                    <div className="mt-1.5">
                      <BibleReferenceListField
                        control={control}
                        register={register}
                        errors={errors}
                        name={`prayerPoints.${index}.references`}
                        addLabel="Ajouter un verset"
                        emptyHint="Aucune référence pour ce point."
                        compact
                      />
                    </div>
                  </div>
                </AppCardContent>
              </AppCard>
            </div>
          );
        })}
      </div>

      <AppButton
        type="button"
        variant="outline"
        onClick={() => append({ id: createPointId(), title: "", references: [] })}
      >
        <Plus className="size-4" />
        Ajouter un point de prière
      </AppButton>
    </div>
  );
}
