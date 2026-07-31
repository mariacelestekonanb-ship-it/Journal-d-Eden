"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { AppButton } from "@/shared/components/app-button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";

import { DEFAULT_TESTIMONY_FORM_VALUES, testimonySchema, type TestimonyFormValues } from "../validation/testimony.schema";

export interface TestimonyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSubmitting: boolean;
  onSubmit: (values: TestimonyFormValues) => void;
}

/** Formulaire de publication d'un témoignage — titre + contenu, ouvert à tout membre connecté. */
export function TestimonyFormDialog({ open, onOpenChange, isSubmitting, onSubmit }: TestimonyFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TestimonyFormValues>({
    resolver: zodResolver(testimonySchema),
    defaultValues: DEFAULT_TESTIMONY_FORM_VALUES,
  });

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) reset(DEFAULT_TESTIMONY_FORM_VALUES);
    onOpenChange(nextOpen);
  }

  function submit(values: TestimonyFormValues) {
    onSubmit(values);
    reset(DEFAULT_TESTIMONY_FORM_VALUES);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Nouveau témoignage</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="testimony-title">Titre</Label>
            <Input id="testimony-title" {...register("title")} placeholder="Ex. Une guérison inattendue" />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="testimony-content">Votre témoignage</Label>
            <Textarea id="testimony-content" rows={6} {...register("content")} placeholder="Racontez ce que Dieu a fait..." />
            {errors.content && <p className="text-sm text-destructive">{errors.content.message}</p>}
          </div>

          <DialogFooter>
            <AppButton type="button" variant="ghost" onClick={() => handleOpenChange(false)}>
              Annuler
            </AppButton>
            <AppButton type="submit" isLoading={isSubmitting}>
              Publier
            </AppButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
