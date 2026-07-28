import { Controller, type Control, type FieldErrors } from "react-hook-form";

import { Label } from "@/shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";

import type { PlanningLeaderOption } from "../types/planning.types";
import type { PlanningSlotFormValues } from "../validation/planning-slot.schema";

const NONE_VALUE = "__none__";

export interface PlanningFormLeaderFieldsProps {
  control: Control<PlanningSlotFormValues>;
  errors: FieldErrors<PlanningSlotFormValues>;
  leaders?: PlanningLeaderOption[];
}

/** Sélection du conducteur principal (requis) et secondaire (optionnel). */
export function PlanningFormLeaderFields({ control, errors, leaders }: PlanningFormLeaderFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="primaryLeaderId">Conducteur principal</Label>
        <Controller
          control={control}
          name="primaryLeaderId"
          render={({ field }) => (
            <Select value={field.value || undefined} onValueChange={field.onChange}>
              <SelectTrigger id="primaryLeaderId" aria-invalid={!!errors.primaryLeaderId}>
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                {leaders?.map((leader) => (
                  <SelectItem key={leader.id} value={leader.id}>
                    {leader.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.primaryLeaderId && <p className="text-xs text-destructive">{errors.primaryLeaderId.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="secondaryLeaderId">Conducteur secondaire</Label>
        <Controller
          control={control}
          name="secondaryLeaderId"
          render={({ field }) => (
            <Select
              value={field.value || NONE_VALUE}
              onValueChange={(value) => field.onChange(value === NONE_VALUE ? "" : value)}
            >
              <SelectTrigger id="secondaryLeaderId">
                <SelectValue placeholder="Aucun" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE_VALUE}>Aucun</SelectItem>
                {leaders?.map((leader) => (
                  <SelectItem key={leader.id} value={leader.id}>
                    {leader.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.secondaryLeaderId && (
          <p className="text-xs text-destructive">{errors.secondaryLeaderId.message}</p>
        )}
      </div>
    </div>
  );
}
