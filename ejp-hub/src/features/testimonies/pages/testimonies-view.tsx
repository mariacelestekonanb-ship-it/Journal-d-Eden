"use client";

import { Plus, Sparkles } from "lucide-react";
import * as React from "react";

import { useUser } from "@/features/auth";
import { AppButton } from "@/shared/components/app-button";
import { AppEmptyState } from "@/shared/components/app-empty-state";
import { AppPageHeader } from "@/shared/components/app-page-header";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import type { Role } from "@/shared/constants/roles";
import { Skeleton } from "@/shared/ui/skeleton";
import { getFullName } from "@/shared/utils/get-full-name";

import { TestimonyCard } from "../components/testimony-card";
import { TestimonyFormDialog } from "../components/testimony-form-dialog";
import { useCreateTestimony, useDeleteTestimony } from "../hooks/use-testimony-mutations";
import { useTestimonies } from "../hooks/use-testimonies";
import type { Testimony } from "../types/testimony.types";
import { canDeleteTestimony } from "../utils/testimony-permissions";

export interface TestimoniesViewProps {
  role: Role;
}

/**
 * Composition de la page Témoignages — publication libre, ouverte à tout
 * membre connecté (admin ou conducteur), sans modération. Voir TESTIMONIES.md.
 */
export function TestimoniesView({ role }: TestimoniesViewProps) {
  const { profile } = useUser();
  const { data: testimonies, isLoading, isError, refetch } = useTestimonies();

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState<Testimony | null>(null);

  const createMutation = useCreateTestimony();
  const deleteMutation = useDeleteTestimony();

  return (
    <div className="space-y-6">
      <AppPageHeader
        title="Témoignages"
        description="Partagez ce que Dieu fait à travers les temps de prière de la communauté."
        actions={
          <AppButton onClick={() => setIsFormOpen(true)}>
            <Plus className="size-4" />
            Nouveau témoignage
          </AppButton>
        }
      />

      {isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <p className="text-sm text-muted-foreground">Impossible de charger les témoignages pour le moment.</p>
          <AppButton variant="outline" size="sm" onClick={() => refetch()}>
            Réessayer
          </AppButton>
        </div>
      )}

      {!isLoading && !isError && testimonies?.length === 0 && (
        <AppEmptyState
          icon={Sparkles}
          title="Aucun témoignage"
          description="Soyez le premier à partager ce que Dieu a fait dans votre vie ou celle de votre entourage."
        />
      )}

      {!isLoading && !isError && testimonies && testimonies.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {testimonies.map((testimony) => (
            <TestimonyCard
              key={testimony.id}
              testimony={testimony}
              canDelete={!!profile && canDeleteTestimony(testimony, profile.id, role)}
              onDelete={setConfirmDelete}
            />
          ))}
        </div>
      )}

      <TestimonyFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        isSubmitting={createMutation.isPending}
        onSubmit={(values) => {
          if (!profile) return;
          createMutation.mutate(
            { values, authorId: profile.id, authorName: getFullName(profile) },
            { onSuccess: () => setIsFormOpen(false) },
          );
        }}
      />

      <ConfirmDialog
        open={!!confirmDelete}
        onOpenChange={(open) => !open && setConfirmDelete(null)}
        title="Supprimer ce témoignage ?"
        description={`« ${confirmDelete?.title} » sera définitivement supprimé. Cette action est irréversible.`}
        confirmLabel="Supprimer"
        isLoading={deleteMutation.isPending}
        onConfirm={async () => {
          if (!confirmDelete) return;
          await deleteMutation.mutateAsync(confirmDelete.id);
          setConfirmDelete(null);
        }}
      />
    </div>
  );
}
