import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { Controller } from "react-hook-form";

import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Switch } from "@/shared/ui/switch";

import type { ReportFormValues } from "../validation/report.schema";

export interface ReportGeneralInfoFieldsProps {
  control: Control<ReportFormValues>;
  register: UseFormRegister<ReportFormValues>;
  errors: FieldErrors<ReportFormValues>;
}

/** Section « Informations générales » — date, horaires (préremplis depuis le Planning), personnes connectées, instrumental. */
export function ReportGeneralInfoFields({ control, register, errors }: ReportGeneralInfoFieldsProps) {
  const generalInfoErrors = errors.generalInfo;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="generalInfo.date">Date</Label>
          <Input
            id="generalInfo.date"
            type="date"
            aria-invalid={!!generalInfoErrors?.date}
            {...register("generalInfo.date")}
          />
          {generalInfoErrors?.date && <p className="text-xs text-destructive">{generalInfoErrors.date.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="generalInfo.startTime">Heure de début</Label>
          <Input
            id="generalInfo.startTime"
            type="time"
            aria-invalid={!!generalInfoErrors?.startTime}
            {...register("generalInfo.startTime")}
          />
          {generalInfoErrors?.startTime && (
            <p className="text-xs text-destructive">{generalInfoErrors.startTime.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="generalInfo.endTime">Heure de fin</Label>
          <Input
            id="generalInfo.endTime"
            type="time"
            aria-invalid={!!generalInfoErrors?.endTime}
            {...register("generalInfo.endTime")}
          />
          {generalInfoErrors?.endTime && (
            <p className="text-xs text-destructive">{generalInfoErrors.endTime.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="generalInfo.connectedCount">Nombre de personnes connectées</Label>
          <Input
            id="generalInfo.connectedCount"
            type="number"
            min={0}
            aria-invalid={!!generalInfoErrors?.connectedCount}
            {...register("generalInfo.connectedCount")}
          />
          {generalInfoErrors?.connectedCount && (
            <p className="text-xs text-destructive">{generalInfoErrors.connectedCount.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border p-3">
          <div>
            <Label htmlFor="generalInfo.hasInstrumental">Instrumental</Label>
            <p className="text-xs text-muted-foreground">Un instrument a-t-il accompagné ce temps de prière ?</p>
          </div>
          <Controller
            control={control}
            name="generalInfo.hasInstrumental"
            render={({ field }) => (
              <Switch
                id="generalInfo.hasInstrumental"
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-label="Instrumental"
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}
