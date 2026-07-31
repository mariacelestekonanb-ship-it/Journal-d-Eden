"use client";

import { BellRing } from "lucide-react";

import { AppBadge } from "@/shared/components/app-badge";
import { AppButton } from "@/shared/components/app-button";
import { AppCard, AppCardContent, AppCardHeader, AppCardTitle } from "@/shared/components/app-card";
import { Skeleton } from "@/shared/ui/skeleton";
import { formatDate } from "@/shared/utils/format";

import { useSendReportReminder } from "../hooks/use-report-mutations";
import { usePendingReportSlots } from "../hooks/use-reports";

/**
 * Vue admin : créneaux passés sans compte rendu, tous conducteurs
 * confondus — le pendant, sur cette page, du compteur « CR en attente » du
 * tableau de bord (qui ne menait nulle part avant que la sélection de
 * créneau ne soit corrigée). « Relancer » envoie la même notification que
 * la relance quotidienne automatique, mais immédiatement.
 *
 * Volontairement titré différemment de la carte statistique « En attente »
 * (`ReportStatistics`, `report.status === "SUBMITTED"`) — un créneau ici n'a
 * même pas encore de brouillon, alors que « En attente » désigne un CR déjà
 * rédigé et soumis, qui attend une validation admin. Les deux notions se
 * ressemblent trop pour partager un même mot sans confusion.
 */
export function PendingReportsSection() {
  const { data: slots, isLoading } = usePendingReportSlots(true);
  const reminderMutation = useSendReportReminder();

  if (isLoading) {
    return (
      <AppCard className="p-4">
        <Skeleton className="h-24 w-full" />
      </AppCard>
    );
  }

  if (!slots || slots.length === 0) return null;

  return (
    <AppCard className="p-4">
      <AppCardHeader className="flex-row items-center justify-between gap-2 p-0 pb-2">
        <AppCardTitle className="text-sm font-medium text-muted-foreground">
          Créneaux sans compte rendu ({slots.length})
        </AppCardTitle>
      </AppCardHeader>
      <AppCardContent className="space-y-2 p-0">
        {slots.map((slot) => (
          <div
            key={slot.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3"
          >
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-foreground">{slot.title}</p>
              <p className="text-xs text-muted-foreground">
                {formatDate(slot.date, "d MMM yyyy")} · <AppBadge variant="secondary">{slot.leaderName}</AppBadge>
              </p>
            </div>
            <AppButton
              size="sm"
              variant="outline"
              disabled={reminderMutation.isPending}
              onClick={() =>
                reminderMutation.mutate({
                  leaderId: slot.leaderId,
                  slotTitle: slot.title,
                  slotDate: formatDate(slot.date, "dd/MM/yyyy"),
                })
              }
            >
              <BellRing className="size-4" />
              Relancer
            </AppButton>
          </div>
        ))}
      </AppCardContent>
    </AppCard>
  );
}
