"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";

import { useCreateTestimony } from "../hooks/use-testimonies";
import { testimonySchema, type TestimonyFormValues } from "../validation/testimony.schema";

export function TestimonyFormDialog({
  open,
  onOpenChange,
  authorId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  authorId: string;
}) {
  const createMutation = useCreateTestimony(authorId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TestimonyFormValues>({
    resolver: zodResolver(testimonySchema),
    defaultValues: { title: "", content: "" },
  });

  async function onSubmit(values: TestimonyFormValues) {
    await createMutation.mutateAsync(values);
    reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Partager un témoignage</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input id="title" aria-invalid={!!errors.title} {...register("title")} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Votre témoignage</Label>
            <Textarea id="content" rows={6} aria-invalid={!!errors.content} {...register("content")} />
            {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending && <Loader2 className="size-4 animate-spin" />}
              Publier
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
