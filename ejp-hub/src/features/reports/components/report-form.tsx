"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";

import { AppButton } from "@/shared/components/app-button";

import { ReportValidationService } from "../services/report-validation.service";
import { DEFAULT_REPORT_FORM_VALUES, reportFormSchema, type ReportFormValues } from "../validation/report.schema";
import { ReportFormFields } from "./report-form-fields";

export interface ReportFormProps {
  defaultValues?: Partial<ReportFormValues>;
  isSaving: boolean;
  isSubmittingReport: boolean;
  onSave: (values: ReportFormValues) => void;
  onSubmitReport: (values: ReportFormValues) => void;
  onCancel: () => void;
  onValuesChange?: (values: ReportFormValues) => void;
}

/**
 * Formulaire complet de compte rendu — validation Zod souple (un brouillon
 * incomplet reste enregistrable), complétude de soumission vérifiée en
 * direct par `ReportValidationService` (bouton « Soumettre » désactivé tant
 * qu'il manque des champs).
 */
export function ReportForm({
  defaultValues,
  isSaving,
  isSubmittingReport,
  onSave,
  onSubmitReport,
  onCancel,
  onValuesChange,
}: ReportFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: { ...DEFAULT_REPORT_FORM_VALUES, ...defaultValues },
  });

  const watchedValues = watch();
  const watchedValuesRef = React.useRef(watchedValues);
  watchedValuesRef.current = watchedValues;
  const serializedValues = JSON.stringify(watchedValues);

  React.useEffect(() => {
    onValuesChange?.(watchedValuesRef.current);
  }, [serializedValues, onValuesChange]);

  const completeness = ReportValidationService.checkCompleteness(watchedValues);

  return (
    <form className="space-y-4" noValidate>
      <ReportFormFields control={control} register={register} errors={errors} />

      {!completeness.isComplete && (
        <div className="rounded-lg border border-warning/40 bg-warning/10 p-3 text-xs text-warning-foreground">
          Champs à compléter avant soumission : {completeness.missingFields.join(", ")}.
        </div>
      )}

      <div className="flex flex-wrap justify-end gap-2">
        <AppButton type="button" variant="outline" onClick={onCancel}>
          Annuler
        </AppButton>
        <AppButton type="button" variant="outline" isLoading={isSaving} onClick={handleSubmit(onSave)}>
          Enregistrer le brouillon
        </AppButton>
        <AppButton
          type="button"
          isLoading={isSubmittingReport}
          disabled={!completeness.isComplete}
          onClick={handleSubmit(onSubmitReport)}
        >
          Soumettre
        </AppButton>
      </div>
    </form>
  );
}
