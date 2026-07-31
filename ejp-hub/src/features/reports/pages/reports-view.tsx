"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import * as React from "react";
import type { RowSelectionState } from "@tanstack/react-table";

import { useUser } from "@/features/auth";
import { AppButton } from "@/shared/components/app-button";
import { AppCard, AppCardContent, AppCardHeader, AppCardTitle } from "@/shared/components/app-card";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import type { Role } from "@/shared/constants/roles";
import { Skeleton } from "@/shared/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";

import { PendingReportsSection } from "../components/pending-reports-section";
import { ReportFilters } from "../components/report-filters";
import { ReportHeader } from "../components/report-header";
import { ReportStatistics } from "../components/report-statistics";
import { ReportTable } from "../components/report-table";
import { useSubmitReport, useDeleteReport } from "../hooks/use-report-mutations";
import { computeReportStats } from "../hooks/use-report-stats";
import { useReports } from "../hooks/use-reports";
import { applyReportFilters, useReportsFilters } from "../hooks/use-reports-filters";
import type { Report } from "../types/report.types";
import { deriveAuthorOptions, deriveLeaderOptions } from "../utils/derive-report-options";
import { getReportPermissions } from "../utils/report-permissions";

type ReportScope = "all" | "mine";

const ReportEvolutionChart = dynamic(
  () => import("../components/report-evolution-chart").then((mod) => mod.ReportEvolutionChart),
  { ssr: false, loading: () => <Skeleton className="h-[180px] w-full" /> },
);

export interface ReportsViewProps {
  role: Role;
}

/**
 * Composition de la page Comptes rendus. Consultation et modification
 * vivent sur des pages dédiées (`/comptes-rendus/[id]`,
 * `/comptes-rendus/[id]/modifier`) — cette page orchestre uniquement la
 * liste (statistiques, filtres, tableau).
 */
export function ReportsView({ role }: ReportsViewProps) {
  const permissions = React.useMemo(() => getReportPermissions(role), [role]);
  const { profile } = useUser();
  const router = useRouter();

  const { data: reports, isLoading, isError, refetch } = useReports();
  const { filters, updateFilter, resetFilters, hasActiveFilters } = useReportsFilters();
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [confirmReport, setConfirmReport] = React.useState<Report | null>(null);
  const [scope, setScope] = React.useState<ReportScope>("all");

  const submitMutation = useSubmitReport();
  const deleteMutation = useDeleteReport();

  // Un admin voit par défaut l'activité de toute l'organisation ; « Mes créneaux » restreint
  // aux CR dont il est lui-même le conducteur assigné (il peut aussi être conducteur, pas
  // seulement administrateur — voir REPORTS.md). Sans objet pour un conducteur, qui ne voit
  // de toute façon jamais que ses propres CR (isolation appliquée dès `ReportRepository.list`).
  const scopedReports = React.useMemo(() => {
    if (scope === "all" || !profile) return reports ?? [];
    return (reports ?? []).filter((report) => report.leader.id === profile.id);
  }, [reports, scope, profile]);

  const stats = React.useMemo(() => computeReportStats(scopedReports), [scopedReports]);
  const filteredReports = React.useMemo(() => applyReportFilters(scopedReports, filters), [scopedReports, filters]);
  const leaderOptions = React.useMemo(() => deriveLeaderOptions(scopedReports), [scopedReports]);
  const authorOptions = React.useMemo(() => deriveAuthorOptions(scopedReports), [scopedReports]);

  const callbacks = React.useMemo(
    () => ({
      onView: (report: Report) => router.push(`/comptes-rendus/${report.id}`),
      onEdit: (report: Report) => router.push(`/comptes-rendus/${report.id}/modifier`),
      onSubmit: (report: Report) => submitMutation.mutate(report.id),
      onDelete: (report: Report) => setConfirmReport(report),
    }),
    [router, submitMutation],
  );

  return (
    <div className="space-y-6">
      <ReportHeader permissions={permissions} />

      {permissions.canViewAll && (
        <>
          <PendingReportsSection />

          <Tabs value={scope} onValueChange={(value) => setScope(value as ReportScope)}>
            <TabsList>
              <TabsTrigger value="all">Toute l&apos;organisation</TabsTrigger>
              <TabsTrigger value="mine">Mes créneaux</TabsTrigger>
            </TabsList>
          </Tabs>
        </>
      )}

      <ReportStatistics stats={stats} isLoading={isLoading} />

      <AppCard className="p-4">
        <AppCardHeader className="p-0 pb-2">
          <AppCardTitle className="text-sm font-medium text-muted-foreground">Évolution (6 derniers mois)</AppCardTitle>
        </AppCardHeader>
        <AppCardContent className="p-0">
          <ReportEvolutionChart data={stats.evolution} />
        </AppCardContent>
      </AppCard>

      <ReportFilters
        filters={filters}
        onChange={updateFilter}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
        leaderOptions={leaderOptions}
        authorOptions={authorOptions}
      />

      {isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      )}
      {isError && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <p className="text-sm text-muted-foreground">Impossible de charger les comptes rendus pour le moment.</p>
          <AppButton variant="outline" size="sm" onClick={() => refetch()}>
            Réessayer
          </AppButton>
        </div>
      )}

      {!isLoading && !isError && (
        <ReportTable
          reports={filteredReports}
          permissions={permissions}
          currentUserId={profile?.id ?? ""}
          callbacks={callbacks}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
        />
      )}

      <ConfirmDialog
        open={!!confirmReport}
        onOpenChange={(open) => !open && setConfirmReport(null)}
        title="Supprimer ce compte rendu ?"
        description={`Le compte rendu de « ${confirmReport?.planningSlot.title} » sera définitivement supprimé. Cette action est irréversible.`}
        confirmLabel="Supprimer"
        isLoading={deleteMutation.isPending}
        onConfirm={async () => {
          if (!confirmReport) return;
          await deleteMutation.mutateAsync(confirmReport.id);
          setConfirmReport(null);
        }}
      />
    </div>
  );
}
