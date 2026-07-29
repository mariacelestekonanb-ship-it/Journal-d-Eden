"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { AppButton } from "@/shared/components/app-button";
import { DialogFooter } from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";

import { ADMIN_CATEGORY_SCOPE_LABELS, ADMIN_CATEGORY_SCOPE_OPTIONS } from "../utils/admin-category-scope";
import { adminCategorySchema, type AdminCategoryFormValues } from "../validation/admin-category.schema";

export interface AdminCategoryFormProps {
  defaultValues: AdminCategoryFormValues;
  isEditing: boolean;
  isSubmitting: boolean;
  onSubmit: (values: AdminCategoryFormValues) => void;
  onCancel: () => void;
}

/** Formulaire de création/modification d'une catégorie configurable. */
export function AdminCategoryForm({ defaultValues, isEditing, isSubmitting, onSubmit, onCancel }: AdminCategoryFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AdminCategoryFormValues>({
    resolver: zodResolver(adminCategorySchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="scope">Liste</Label>
        <Controller
          control={control}
          name="scope"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="scope">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ADMIN_CATEGORY_SCOPE_OPTIONS.map((scope) => (
                  <SelectItem key={scope} value={scope}>
                    {ADMIN_CATEGORY_SCOPE_LABELS[scope]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="label">Libellé</Label>
        <Input id="label" aria-invalid={!!errors.label} {...register("label")} />
        {errors.label && <p className="text-xs text-destructive">{errors.label.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="value">Valeur technique</Label>
        <Input id="value" placeholder="EX_NOUVELLE_VALEUR" aria-invalid={!!errors.value} {...register("value")} />
        {errors.value && <p className="text-xs text-destructive">{errors.value.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="sortOrder">Ordre d&apos;affichage</Label>
        <Input id="sortOrder" type="number" min={0} aria-invalid={!!errors.sortOrder} {...register("sortOrder")} />
        {errors.sortOrder && <p className="text-xs text-destructive">{errors.sortOrder.message}</p>}
      </div>

      <DialogFooter>
        <AppButton type="button" variant="outline" onClick={onCancel}>
          Annuler
        </AppButton>
        <AppButton type="submit" isLoading={isSubmitting}>
          {isEditing ? "Enregistrer" : "Créer"}
        </AppButton>
      </DialogFooter>
    </form>
  );
}
