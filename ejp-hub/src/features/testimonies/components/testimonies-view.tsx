"use client";

import { BookHeart, Plus } from "lucide-react";
import * as React from "react";

import { PageHeader } from "@/shared/components/page-header";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { EmptyState } from "@/shared/components/states/empty-state";
import { ErrorState } from "@/shared/components/states/error-state";
import { TableLoadingState } from "@/shared/components/states/loading-state";
import { Button } from "@/shared/components/ui/button";

import { useDeleteTestimony, useTestimonies } from "../hooks/use-testimonies";
import type { TestimonyWithAuthor } from "../types/testimony.types";
import { TestimonyCard } from "./testimony-card";
import { TestimonyFormDialog } from "./testimony-form-dialog";

export function TestimoniesView({ userId, isAdmin }: { userId: string; isAdmin: boolean }) {
  const { data: testimonies, isLoading, isError, refetch } = useTestimonies();
  const deleteMutation = useDeleteTestimony();
  const [formOpen, setFormOpen] = React.useState(false);
  const [testimonyToDelete, setTestimonyToDelete] = React.useState<TestimonyWithAuthor | null>(null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Témoignages"
        description="Partagez ce que Dieu fait à travers les temps de prière de la communauté."
        actions={
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="size-4" />
            Partager un témoignage
          </Button>
        }
      />

      {isLoading && <TableLoadingState rows={3} />}
      {isError && <ErrorState onRetry={() => refetch()} />}

      {testimonies && testimonies.length === 0 && (
        <EmptyState
          icon={BookHeart}
          title="Aucun témoignage pour le moment"
          description="Soyez le premier à partager un témoignage avec la communauté."
          action={<Button onClick={() => setFormOpen(true)}>Partager un témoignage</Button>}
        />
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {testimonies?.map((testimony) => (
          <TestimonyCard
            key={testimony.id}
            testimony={testimony}
            canDelete={isAdmin}
            onDelete={() => setTestimonyToDelete(testimony)}
          />
        ))}
      </div>

      <TestimonyFormDialog open={formOpen} onOpenChange={setFormOpen} authorId={userId} />

      <ConfirmDialog
        open={!!testimonyToDelete}
        onOpenChange={(open) => !open && setTestimonyToDelete(null)}
        title="Supprimer ce témoignage ?"
        description={`« ${testimonyToDelete?.title} » sera définitivement supprimé.`}
        isLoading={deleteMutation.isPending}
        onConfirm={async () => {
          if (!testimonyToDelete) return;
          await deleteMutation.mutateAsync(testimonyToDelete.id);
          setTestimonyToDelete(null);
        }}
      />
    </div>
  );
}
