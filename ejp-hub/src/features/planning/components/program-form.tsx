"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { AppButton } from "@/shared/components/app-button";
import { Checkbox } from "@/shared/ui/checkbox";
import { DialogFooter } from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";

import { usePlanningLeaderOptions } from "../hooks/use-planning-slots";
import { DEFAULT_PROGRAM_FORM_VALUES, programSchema, type ProgramFormValues } from "../validation/program.schema";

export interface ProgramFormProps {
  defaultValues?: Partial<ProgramFormValues>;
  isSubmitting: boolean;
  onSubmit: (values: ProgramFormValues) => void;
  onCancel: () => void;
}

/** Formulaire de création/modification d'un programme — nom, description, équipe de conducteurs. */
export function ProgramForm({ defaultValues, isSubmitting, onSubmit, onCancel }: ProgramFormProps) {
  const { data: leaders } = usePlanningLeaderOptions();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProgramFormValues>({
    resolver: zodResolver(programSchema),
    defaultValues: { ...DEFAULT_PROGRAM_FORM_VALUES, ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="name">Nom du programme</Label>
        <Input id="name" placeholder="Programme Jeunesse…" aria-invalid={!!errors.name} {...register("name")} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={2} {...register("description")} />
      </div>

      <div className="space-y-2">
        <Label>Équipe de conducteurs</Label>
        <Controller
          control={control}
          name="memberIds"
          render={({ field }) => (
            <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border border-border p-3">
              {leaders?.length === 0 && <p className="text-sm text-muted-foreground">Aucun conducteur disponible.</p>}
              {leaders?.map((leader) => {
                const checked = field.value.includes(leader.id);
                return (
                  <label key={leader.id} className="flex items-center gap-2 text-sm text-foreground">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(value) => {
                        field.onChange(
                          value ? [...field.value, leader.id] : field.value.filter((id) => id !== leader.id),
                        );
                      }}
                    />
                    {leader.fullName}
                  </label>
                );
              })}
            </div>
          )}
        />
      </div>

      <DialogFooter>
        <AppButton type="button" variant="outline" onClick={onCancel}>
          Annuler
        </AppButton>
        <AppButton type="submit" isLoading={isSubmitting}>
          Enregistrer
        </AppButton>
      </DialogFooter>
    </form>
  );
}
