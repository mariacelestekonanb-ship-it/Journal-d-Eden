"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import * as React from "react";

import { AppButton } from "@/shared/components/app-button";
import { AppCard } from "@/shared/components/app-card";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Skeleton } from "@/shared/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";

import { useAdminCategories } from "../hooks/use-admin-categories";
import { useCreateAdminCategory, useDeleteAdminCategory, useUpdateAdminCategory } from "../hooks/use-admin-category-mutations";
import type { AdminCategory } from "../types/admin.types";
import { ADMIN_CATEGORY_SCOPE_LABELS, ADMIN_CATEGORY_SCOPE_OPTIONS } from "../utils/admin-category-scope";
import { DEFAULT_ADMIN_CATEGORY_FORM_VALUES, type AdminCategoryFormValues } from "../validation/admin-category.schema";
import { AdminCategoryForm } from "./admin-category-form";
import { AdminEmptyState } from "./admin-empty-state";

type DialogState = { mode: "create" } | { mode: "edit"; category: AdminCategory } | null;

/**
 * Gestion des catégories configurables — sujets de prière, types de réunion.
 * CRUD complet sur `admin_categories`, une table indépendante créée pour ce
 * module (voir ADMIN.md#catégories) : elle ne pilote pas encore le
 * formulaire Sujets de prière (qui reste sur l'enum Postgres existant),
 * ce câblage étant hors périmètre de ce sprint.
 */
export function AdminCategoryManager() {
  const { data: categories, isLoading } = useAdminCategories();
  const createMutation = useCreateAdminCategory();
  const updateMutation = useUpdateAdminCategory();
  const deleteMutation = useDeleteAdminCategory();

  const [dialogState, setDialogState] = React.useState<DialogState>(null);
  const [pendingDelete, setPendingDelete] = React.useState<AdminCategory | null>(null);

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  async function handleSubmit(values: AdminCategoryFormValues) {
    if (dialogState?.mode === "edit") {
      await updateMutation.mutateAsync({ id: dialogState.category.id, values });
    } else {
      await createMutation.mutateAsync(values);
    }
    setDialogState(null);
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue={ADMIN_CATEGORY_SCOPE_OPTIONS[0]}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            {ADMIN_CATEGORY_SCOPE_OPTIONS.map((scope) => (
              <TabsTrigger key={scope} value={scope}>
                {ADMIN_CATEGORY_SCOPE_LABELS[scope]}
              </TabsTrigger>
            ))}
          </TabsList>
          <AppButton size="sm" onClick={() => setDialogState({ mode: "create" })}>
            <Plus className="size-4" />
            Nouvelle catégorie
          </AppButton>
        </div>

        {ADMIN_CATEGORY_SCOPE_OPTIONS.map((scope) => {
          const scopedCategories = (categories ?? [])
            .filter((category) => category.scope === scope)
            .sort((a, b) => a.sortOrder - b.sortOrder);

          return (
            <TabsContent key={scope} value={scope} className="mt-4">
              {scopedCategories.length === 0 ? (
                <AdminEmptyState
                  title="Aucune catégorie"
                  description="Aucune entrée dans cette liste pour le moment."
                  action={
                    <AppButton size="sm" variant="outline" onClick={() => setDialogState({ mode: "create" })}>
                      <Plus className="size-4" />
                      Ajouter une entrée
                    </AppButton>
                  }
                />
              ) : (
                <AppCard className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ordre</TableHead>
                        <TableHead>Libellé</TableHead>
                        <TableHead>Valeur technique</TableHead>
                        <TableHead className="w-24 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scopedCategories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell className="text-sm text-muted-foreground">{category.sortOrder}</TableCell>
                          <TableCell className="font-medium text-foreground">{category.label}</TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground">{category.value}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <AppButton
                                variant="ghost"
                                size="icon"
                                aria-label={`Modifier ${category.label}`}
                                onClick={() => setDialogState({ mode: "edit", category })}
                              >
                                <Pencil className="size-4" />
                              </AppButton>
                              <AppButton
                                variant="ghost"
                                size="icon"
                                aria-label={`Supprimer ${category.label}`}
                                onClick={() => setPendingDelete(category)}
                              >
                                <Trash2 className="size-4 text-destructive" />
                              </AppButton>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </AppCard>
              )}
            </TabsContent>
          );
        })}
      </Tabs>

      <Dialog open={dialogState !== null} onOpenChange={(open) => !open && setDialogState(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{dialogState?.mode === "edit" ? "Modifier la catégorie" : "Nouvelle catégorie"}</DialogTitle>
          </DialogHeader>
          <AdminCategoryForm
            defaultValues={dialogState?.mode === "edit" ? { ...dialogState.category } : DEFAULT_ADMIN_CATEGORY_FORM_VALUES}
            isEditing={dialogState?.mode === "edit"}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onCancel={() => setDialogState(null)}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Supprimer cette catégorie ?"
        description={`« ${pendingDelete?.label} » sera définitivement supprimée de cette liste.`}
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
