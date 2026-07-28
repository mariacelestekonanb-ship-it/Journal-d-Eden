"use client";

import { FileText } from "lucide-react";
import * as React from "react";

import { formatDate, formatTime } from "@/lib/format";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { PageHeader } from "@/shared/components/page-header";
import { EmptyState } from "@/shared/components/states/empty-state";
import { ErrorState } from "@/shared/components/states/error-state";
import { TableLoadingState } from "@/shared/components/states/loading-state";
import { Button } from "@/shared/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

import { useDeleteReport, usePendingSlots, useReports } from "../hooks/use-reports";
import type { PendingSlot, ReportWithSlot } from "../types/report.types";
import { ReportCard } from "./report-card";
import { ReportFormDialog } from "./report-form-dialog";

export function ReportsView({ userId, isAdmin }: { userId: string; isAdmin: boolean }) {
  const pendingQuery = usePendingSlots(userId);
  const ownReportsQuery = useReports("own", userId);
  const allReportsQuery = useReports("all", userId);
  const deleteMutation = useDeleteReport();

  const [formTarget, setFormTarget] = React.useState<
    { pendingSlot: PendingSlot } | { existingReport: ReportWithSlot } | null
  >(null);
  const [reportToDelete, setReportToDelete] = React.useState<ReportWithSlot | null>(null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Comptes rendus"
        description="Chaque conducteur rédige le compte rendu de ses propres créneaux de prière."
      />

      <Tabs defaultValue={isAdmin ? "all" : "pending"}>
        <TabsList>
          {!isAdmin && <TabsTrigger value="pending">À rédiger</TabsTrigger>}
          {!isAdmin && <TabsTrigger value="own">Mes comptes rendus</TabsTrigger>}
          {isAdmin && <TabsTrigger value="all">Tous les comptes rendus</TabsTrigger>}
        </TabsList>

        {!isAdmin && (
          <TabsContent value="pending" className="space-y-3">
            {pendingQuery.isLoading && <TableLoadingState rows={3} />}
            {pendingQuery.isError && <ErrorState onRetry={() => pendingQuery.refetch()} />}
            {pendingQuery.data && pendingQuery.data.length === 0 && (
              <EmptyState
                icon={FileText}
                title="Aucun compte rendu en attente"
                description="Vos créneaux passés ont tous leur compte rendu. Bien joué !"
              />
            )}
            {pendingQuery.data?.map((slot) => (
              <div
                key={slot.id}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
              >
                <div>
                  <p className="font-medium">
                    {formatDate(slot.slot_date, "dd/MM/yyyy")} · {formatTime(slot.start_time)}–
                    {formatTime(slot.end_time)}
                  </p>
                  {slot.topic && <p className="text-sm text-muted-foreground">{slot.topic.title}</p>}
                </div>
                <Button size="sm" onClick={() => setFormTarget({ pendingSlot: slot })}>
                  Rédiger
                </Button>
              </div>
            ))}
          </TabsContent>
        )}

        {!isAdmin && (
          <TabsContent value="own" className="space-y-3">
            {ownReportsQuery.isLoading && <TableLoadingState rows={3} />}
            {ownReportsQuery.isError && <ErrorState onRetry={() => ownReportsQuery.refetch()} />}
            {ownReportsQuery.data && ownReportsQuery.data.length === 0 && (
              <EmptyState
                icon={FileText}
                title="Aucun compte rendu"
                description="Vos comptes rendus rédigés apparaîtront ici."
              />
            )}
            {ownReportsQuery.data?.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                canEdit
                canDelete={false}
                showConducteur={false}
                onEdit={() => setFormTarget({ existingReport: report })}
                onDelete={() => setReportToDelete(report)}
              />
            ))}
          </TabsContent>
        )}

        {isAdmin && (
          <TabsContent value="all" className="space-y-3">
            {allReportsQuery.isLoading && <TableLoadingState rows={4} />}
            {allReportsQuery.isError && <ErrorState onRetry={() => allReportsQuery.refetch()} />}
            {allReportsQuery.data && allReportsQuery.data.length === 0 && (
              <EmptyState
                icon={FileText}
                title="Aucun compte rendu"
                description="Les comptes rendus rédigés par les conducteurs apparaîtront ici."
              />
            )}
            {allReportsQuery.data?.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                canEdit={false}
                canDelete
                showConducteur
                onEdit={() => setFormTarget({ existingReport: report })}
                onDelete={() => setReportToDelete(report)}
              />
            ))}
          </TabsContent>
        )}
      </Tabs>

      {formTarget && (
        <ReportFormDialog
          open={!!formTarget}
          onOpenChange={(open) => !open && setFormTarget(null)}
          userId={userId}
          pendingSlot={"pendingSlot" in formTarget ? formTarget.pendingSlot : undefined}
          existingReport={"existingReport" in formTarget ? formTarget.existingReport : undefined}
        />
      )}

      <ConfirmDialog
        open={!!reportToDelete}
        onOpenChange={(open) => !open && setReportToDelete(null)}
        title="Supprimer ce compte rendu ?"
        description="Cette action est irréversible."
        isLoading={deleteMutation.isPending}
        onConfirm={async () => {
          if (!reportToDelete) return;
          await deleteMutation.mutateAsync(reportToDelete.id);
          setReportToDelete(null);
        }}
      />
    </div>
  );
}
