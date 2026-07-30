"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { useUser } from "@/features/auth";
import { AppButton } from "@/shared/components/app-button";
import { AppPageHeader } from "@/shared/components/app-page-header";
import type { Role } from "@/shared/constants/roles";
import { Button } from "@/shared/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Skeleton } from "@/shared/ui/skeleton";
import { formatDate, formatTime } from "@/shared/utils/format";
import { getFullName } from "@/shared/utils/get-full-name";

import { ReportEmptyState } from "../components/report-empty-state";
import { useCreateReport } from "../hooks/use-report-mutations";
import { useAvailableSlots } from "../hooks/use-reports";
import { getReportPermissions } from "../utils/report-permissions";
import { DEFAULT_REPORT_FORM_VALUES } from "../validation/report.schema";

export interface ReportCreateViewProps {
  role: Role;
}

/**
 * Étape unique de création : choisir le créneau à documenter (un créneau ne
 * peut avoir qu'un seul CR). La rédaction complète se poursuit ensuite sur
 * la page de modification — un seul formulaire riche, pas deux à maintenir.
 */
export function ReportCreateView({ role }: ReportCreateViewProps) {
  const permissions = getReportPermissions(role);
  const router = useRouter();
  const { profile } = useUser();
  const { data: availableSlots, isLoading } = useAvailableSlots();
  const [selectedSlotId, setSelectedSlotId] = React.useState<string>("");
  const createMutation = useCreateReport();

  const selectedSlot = availableSlots?.find((slot) => slot.id === selectedSlotId);

  if (!permissions.canCreate) {
    return (
      <ReportEmptyState
        title="Création réservée aux conducteurs"
        description="Seul le conducteur assigné à un créneau peut rédiger le compte rendu correspondant."
      />
    );
  }

  async function handleCreateDraft() {
    if (!selectedSlot || !profile) return;
    const created = await createMutation.mutateAsync({
      values: {
        ...DEFAULT_REPORT_FORM_VALUES,
        generalInfo: {
          ...DEFAULT_REPORT_FORM_VALUES.generalInfo,
          date: selectedSlot.date,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
        },
      },
      slotId: selectedSlot.id,
      leader: { id: selectedSlot.leaderId, fullName: selectedSlot.leaderName },
      author: { id: profile.id, fullName: getFullName(profile) },
    });
    router.push(`/comptes-rendus/${created.id}/modifier`);
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="w-fit">
        <Link href="/comptes-rendus">
          <ArrowLeft className="size-4" />
          Retour aux comptes rendus
        </Link>
      </Button>

      <AppPageHeader
        title="Nouveau compte rendu"
        description="Sélectionnez le créneau de prière à documenter — un seul compte rendu par créneau."
      />

      {isLoading && <Skeleton className="h-32 w-full" />}

      {!isLoading && availableSlots?.length === 0 && (
        <ReportEmptyState
          title="Aucun créneau à documenter"
          description="Aucun de vos créneaux du Planning n'attend de compte rendu pour le moment."
        />
      )}

      {!isLoading && availableSlots && availableSlots.length > 0 && (
        <div className="max-w-lg space-y-4 rounded-xl border border-border bg-card p-4">
          <Select value={selectedSlotId} onValueChange={setSelectedSlotId}>
            <SelectTrigger aria-label="Choisir un créneau">
              <SelectValue placeholder="Choisir un créneau du Planning" />
            </SelectTrigger>
            <SelectContent>
              {availableSlots.map((slot) => (
                <SelectItem key={slot.id} value={slot.id}>
                  {slot.title} — {formatDate(slot.date, "d MMM yyyy")} ({slot.leaderName})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedSlot && (
            <div className="rounded-lg bg-muted/40 p-3 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">{selectedSlot.title}</p>
              <p>
                {formatDate(selectedSlot.date, "EEEE d MMMM yyyy")} · {formatTime(selectedSlot.startTime)}–
                {formatTime(selectedSlot.endTime)}
              </p>
              {selectedSlot.location && <p>{selectedSlot.location}</p>}
              <p>Conducteur : {selectedSlot.leaderName}</p>
            </div>
          )}

          <AppButton disabled={!selectedSlot} isLoading={createMutation.isPending} onClick={handleCreateDraft}>
            Créer le brouillon
          </AppButton>
        </div>
      )}
    </div>
  );
}
