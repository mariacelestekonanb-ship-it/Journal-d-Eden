"use client";

import { Plus, Users } from "lucide-react";
import * as React from "react";

import { AppButton } from "@/shared/components/app-button";
import { AppEmptyState } from "@/shared/components/app-empty-state";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Skeleton } from "@/shared/ui/skeleton";

import { useCreateProgram, useDeleteProgram, useUpdateProgram } from "../hooks/use-program-mutations";
import { usePrograms } from "../hooks/use-programs";
import type { Program } from "../types/planning.types";
import { DEFAULT_PROGRAM_FORM_VALUES, type ProgramFormValues } from "../validation/program.schema";
import { ProgramCard } from "./program-card";
import { ProgramForm } from "./program-form";

type DialogState = { mode: "create" } | { mode: "edit"; program: Program } | null;

export interface ProgramsTabProps {
  canManage: boolean;
  onViewProgramPlanning: (programId: string) => void;
}

/**
 * Onglet « Programmes » du Planning : liste des programmes (équipe de
 * conducteurs dédiée), avec un raccourci vers le planning filtré de chacun
 * (voir `onViewProgramPlanning`, câblé par `PlanningView` sur les filtres
 * généraux — pas de vue calendrier/liste dupliquée ici).
 */
export function ProgramsTab({ canManage, onViewProgramPlanning }: ProgramsTabProps) {
  const { data: programs, isLoading } = usePrograms();
  const createMutation = useCreateProgram();
  const updateMutation = useUpdateProgram();
  const deleteMutation = useDeleteProgram();

  const [dialogState, setDialogState] = React.useState<DialogState>(null);
  const [pendingDelete, setPendingDelete] = React.useState<Program | null>(null);

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  async function handleSubmit(values: ProgramFormValues) {
    if (dialogState?.mode === "edit") {
      await updateMutation.mutateAsync({ id: dialogState.program.id, values });
    } else {
      await createMutation.mutateAsync(values);
    }
    setDialogState(null);
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {canManage && (
        <div className="flex justify-end">
          <AppButton size="sm" onClick={() => setDialogState({ mode: "create" })}>
            <Plus className="size-4" />
            Nouveau programme
          </AppButton>
        </div>
      )}

      {programs?.length === 0 ? (
        <AppEmptyState
          icon={Users}
          title="Aucun programme"
          description="Regroupez certains créneaux et une équipe de conducteurs dédiée dans un programme (ex. « Programme Jeunesse »)."
          action={
            canManage && (
              <AppButton size="sm" variant="outline" onClick={() => setDialogState({ mode: "create" })}>
                <Plus className="size-4" />
                Créer un programme
              </AppButton>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {programs?.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              canManage={canManage}
              onViewPlanning={() => onViewProgramPlanning(program.id)}
              onEdit={() => setDialogState({ mode: "edit", program })}
              onDelete={() => setPendingDelete(program)}
            />
          ))}
        </div>
      )}

      <Dialog open={dialogState !== null} onOpenChange={(open) => !open && setDialogState(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{dialogState?.mode === "edit" ? "Modifier le programme" : "Nouveau programme"}</DialogTitle>
          </DialogHeader>
          <ProgramForm
            defaultValues={
              dialogState?.mode === "edit"
                ? {
                    name: dialogState.program.name,
                    description: dialogState.program.description ?? "",
                    memberIds: dialogState.program.members.map((member) => member.id),
                  }
                : DEFAULT_PROGRAM_FORM_VALUES
            }
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onCancel={() => setDialogState(null)}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Supprimer ce programme ?"
        description={`« ${pendingDelete?.name} » sera définitivement supprimé. Les créneaux qui y étaient rattachés resteront dans le planning général, sans programme.`}
        confirmLabel="Supprimer"
        isLoading={deleteMutation.isPending}
        onConfirm={async () => {
          if (!pendingDelete) return;
          await deleteMutation.mutateAsync(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
