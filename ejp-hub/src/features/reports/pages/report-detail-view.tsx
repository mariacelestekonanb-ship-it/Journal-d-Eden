"use client";

import { ArrowLeft, CheckCircle2, Pencil, Send, Trash2, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { useUser } from "@/features/auth";
import { AppButton } from "@/shared/components/app-button";
import { AppCard, AppCardContent, AppCardHeader, AppCardTitle } from "@/shared/components/app-card";
import { AppPageHeader } from "@/shared/components/app-page-header";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import type { Role } from "@/shared/constants/roles";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { formatDate } from "@/shared/utils/format";

import { ReportCard } from "../components/report-card";
import { ReportComments } from "../components/report-comments";
import { ReportEmptyState } from "../components/report-empty-state";
import { ReportExportMenu } from "../components/report-export-menu";
import { ReportSummary } from "../components/report-summary";
import { ReportTimeline } from "../components/report-timeline";
import { useDeleteReport, useRejectReport, useSubmitReport, useValidateReport } from "../hooks/use-report-mutations";
import { useReportComments, useReports } from "../hooks/use-reports";
import { ReportWorkflowService } from "../services/report-workflow.service";
import { buildReportTimeline } from "../utils/build-report-timeline";
import { getReportPermissions } from "../utils/report-permissions";

export interface ReportDetailViewProps {
  role: Role;
  reportId: string;
}

/** Vue détaillée d'un compte rendu — informations du créneau, résumé structuré, historique complet, actions du workflow. */
export function ReportDetailView({ role, reportId }: ReportDetailViewProps) {
  const permissions = React.useMemo(() => getReportPermissions(role), [role]);
  const { profile } = useUser();
  const router = useRouter();

  const { data: reports, isLoading } = useReports();
  const report = reports?.find((candidate) => candidate.id === reportId);
  const { data: comments = [] } = useReportComments(reportId);

  const submitMutation = useSubmitReport();
  const validateMutation = useValidateReport();
  const rejectMutation = useRejectReport();
  const deleteMutation = useDeleteReport();
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  if (!report) {
    return <ReportEmptyState title="Compte rendu introuvable" description="Ce compte rendu n'existe pas ou a été supprimé." />;
  }

  const isOwner = report.authorId === profile?.id;
  const canEdit = isOwner && ReportWorkflowService.isEditable(report.status);
  const canSubmit = isOwner && ReportWorkflowService.isSubmittable(report.status);
  const canValidate = permissions.canValidate && ReportWorkflowService.isValidatable(report.status);
  const canReject = permissions.canReject && ReportWorkflowService.isRejectable(report.status);

  const timeline = buildReportTimeline(report, comments);

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="w-fit">
        <Link href="/comptes-rendus">
          <ArrowLeft className="size-4" />
          Retour aux comptes rendus
        </Link>
      </Button>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <AppPageHeader
          title={`Chaîne de prière — ${report.planningSlot.title}`}
          description={`${formatDate(report.generalInfo.date, "EEEE d MMMM yyyy")} · ${report.leader.fullName}`}
        />
        <div className="flex flex-wrap gap-2">
          {canEdit && (
            <Button asChild variant="outline">
              <Link href={`/comptes-rendus/${report.id}/modifier`}>
                <Pencil className="size-4" />
                Modifier
              </Link>
            </Button>
          )}
          {canSubmit && (
            <AppButton isLoading={submitMutation.isPending} onClick={() => submitMutation.mutate(report.id)}>
              <Send className="size-4" />
              Soumettre
            </AppButton>
          )}
          {canValidate && (
            <AppButton
              variant="outline"
              isLoading={validateMutation.isPending}
              onClick={() => validateMutation.mutate(report.id)}
            >
              <CheckCircle2 className="size-4" />
              Valider
            </AppButton>
          )}
          {canReject && (
            <AppButton
              variant="destructive"
              isLoading={rejectMutation.isPending}
              onClick={() => rejectMutation.mutate(report.id)}
            >
              <XCircle className="size-4" />
              Rejeter
            </AppButton>
          )}
          {permissions.canExport && <ReportExportMenu report={report} />}
          {permissions.canDelete && (
            <AppButton variant="destructive" onClick={() => setConfirmOpen(true)}>
              <Trash2 className="size-4" />
              Supprimer
            </AppButton>
          )}
        </div>
      </div>

      <ReportCard report={report} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <AppCard className="p-4 print:border-none print:shadow-none" id="report-print-area">
            <AppCardContent className="p-0">
              <ReportSummary report={report} />
            </AppCardContent>
          </AppCard>

          <AppCard className="p-4">
            <AppCardHeader className="p-0 pb-3">
              <AppCardTitle>Commentaires</AppCardTitle>
            </AppCardHeader>
            <AppCardContent className="p-0">
              <ReportComments reportId={report.id} comments={comments} canComment={permissions.canComment} />
            </AppCardContent>
          </AppCard>
        </div>

        <AppCard className="p-4">
          <AppCardHeader className="p-0 pb-3">
            <AppCardTitle>Historique</AppCardTitle>
          </AppCardHeader>
          <AppCardContent className="p-0">
            <ReportTimeline entries={timeline} />
          </AppCardContent>
        </AppCard>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Supprimer ce compte rendu ?"
        description={`Le compte rendu de « ${report.planningSlot.title} » sera définitivement supprimé. Cette action est irréversible.`}
        confirmLabel="Supprimer"
        isLoading={deleteMutation.isPending}
        onConfirm={async () => {
          await deleteMutation.mutateAsync(report.id);
          router.push("/comptes-rendus");
        }}
      />
    </div>
  );
}
