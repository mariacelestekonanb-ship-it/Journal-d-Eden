"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { useUser } from "@/features/auth";
import { AppPageHeader } from "@/shared/components/app-page-header";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";

import { ReportCard } from "../components/report-card";
import { ReportEmptyState } from "../components/report-empty-state";
import { ReportForm } from "../components/report-form";
import { useReportAutosave } from "../hooks/use-report-autosave";
import { useSubmitReport, useUpdateReport } from "../hooks/use-report-mutations";
import { useReports } from "../hooks/use-reports";
import { ReportWorkflowService } from "../services/report-workflow.service";
import { mapReportToFormValues } from "../utils/map-report-to-form-values";
import { DEFAULT_REPORT_FORM_VALUES, type ReportFormValues } from "../validation/report.schema";

const AUTOSAVE_LABELS: Record<string, string> = {
  idle: "",
  saving: "Enregistrement…",
  saved: "Brouillon enregistré automatiquement.",
};

export interface ReportEditViewProps {
  reportId: string;
}

/** Rédaction complète d'un compte rendu — brouillon initial ou correction après rejet, avec sauvegarde automatique. */
export function ReportEditView({ reportId }: ReportEditViewProps) {
  const router = useRouter();
  const { profile } = useUser();
  const { data: reports, isLoading } = useReports();
  const report = reports?.find((candidate) => candidate.id === reportId);

  const [liveValues, setLiveValues] = React.useState<ReportFormValues>(DEFAULT_REPORT_FORM_VALUES);
  const updateMutation = useUpdateReport();
  const submitMutation = useSubmitReport();

  const isOwner = !!report && report.authorId === profile?.id;
  const isEditable = !!report && isOwner && ReportWorkflowService.isEditable(report.status);
  const autosaveStatus = useReportAutosave(report?.id, liveValues, isEditable);

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  if (!report) {
    return <ReportEmptyState title="Compte rendu introuvable" description="Ce compte rendu n'existe pas ou a été supprimé." />;
  }

  if (!isEditable) {
    return (
      <ReportEmptyState
        title="Modification impossible"
        description="Ce compte rendu n'est plus modifiable (déjà soumis, validé, ou vous n'en êtes pas l'auteur)."
      />
    );
  }

  async function handleSave(values: ReportFormValues) {
    await updateMutation.mutateAsync({ id: report!.id, values });
    router.push(`/comptes-rendus/${report!.id}`);
  }

  async function handleSubmitReport(values: ReportFormValues) {
    await updateMutation.mutateAsync({ id: report!.id, values });
    await submitMutation.mutateAsync(report!.id);
    router.push(`/comptes-rendus/${report!.id}`);
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="w-fit">
        <Link href={`/comptes-rendus/${report.id}`}>
          <ArrowLeft className="size-4" />
          Retour au compte rendu
        </Link>
      </Button>

      <AppPageHeader title="Modifier le compte rendu" description={AUTOSAVE_LABELS[autosaveStatus] || "Vos modifications sont enregistrées automatiquement."} />

      <ReportCard report={report} />

      <ReportForm
        defaultValues={mapReportToFormValues(report)}
        isSaving={updateMutation.isPending}
        isSubmittingReport={submitMutation.isPending}
        onSave={handleSave}
        onSubmitReport={handleSubmitReport}
        onCancel={() => router.push(`/comptes-rendus/${report.id}`)}
        onValuesChange={setLiveValues}
      />
    </div>
  );
}
