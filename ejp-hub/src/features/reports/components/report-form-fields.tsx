"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";

import { AppCard, AppCardContent, AppCardHeader, AppCardTitle } from "@/shared/components/app-card";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";

import type { ReportFormValues } from "../validation/report.schema";
import { BibleReferenceListField } from "./bible-reference-list-field";
import { ReportGeneralInfoFields } from "./report-general-info-fields";
import { ReportPrayerPointsField } from "./report-prayer-points-field";

export interface ReportFormFieldsProps {
  control: Control<ReportFormValues>;
  register: UseFormRegister<ReportFormValues>;
  errors: FieldErrors<ReportFormValues>;
}

function FormSection({ title, delay, children }: { title: string; delay: number; children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay, ease: "easeOut" }}
    >
      <AppCard>
        <AppCardHeader>
          <AppCardTitle>{title}</AppCardTitle>
        </AppCardHeader>
        <AppCardContent>{children}</AppCardContent>
      </AppCard>
    </motion.div>
  );
}

/**
 * Les 6 sections du compte rendu, dans l'ordre fixe du déroulé réel d'une
 * chaîne de prière de l'EJP : informations générales, actions de grâce,
 * invitation du Saint-Esprit, points de prière, fin/actions de grâce,
 * annonces. Chaque section est une Card Shadcn clairement identifiable.
 */
export function ReportFormFields({ control, register, errors }: ReportFormFieldsProps) {
  return (
    <div className="space-y-4">
      <FormSection title="Informations générales" delay={0}>
        <ReportGeneralInfoFields control={control} register={register} errors={errors} />
      </FormSection>

      <FormSection title="Actions de grâce" delay={0.05}>
        <BibleReferenceListField control={control} register={register} errors={errors} name="thanksgiving" />
      </FormSection>

      <FormSection title="Invitation du Saint-Esprit" delay={0.1}>
        <BibleReferenceListField control={control} register={register} errors={errors} name="holySpiritInvitation" />
      </FormSection>

      <FormSection title="Points de prière" delay={0.15}>
        <ReportPrayerPointsField control={control} register={register} errors={errors} />
      </FormSection>

      <FormSection title="Fin / Actions de grâce" delay={0.2}>
        <BibleReferenceListField control={control} register={register} errors={errors} name="closingThanksgiving" />
      </FormSection>

      <FormSection title="Annonces" delay={0.25}>
        <div className="space-y-2">
          <Label htmlFor="announcements">Annonces communiquées à la fin de la chaîne de prière</Label>
          <Textarea id="announcements" rows={4} {...register("announcements")} />
        </div>
      </FormSection>
    </div>
  );
}
