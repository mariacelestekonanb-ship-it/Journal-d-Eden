"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AppButton } from "@/shared/components/app-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

import { updateMemberEmailAction } from "../actions/update-member-email.action";
import { memberEmailSchema, type MemberEmailFormValues } from "../validation/member-email.schema";

export interface MemberEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberId: string;
  currentEmail: string;
  onUpdated: (email: string) => void;
}

/** Changement d'e-mail — réservé à un administrateur (voir `member-email.schema.ts`). */
export function MemberEmailDialog({ open, onOpenChange, memberId, currentEmail, onUpdated }: MemberEmailDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MemberEmailFormValues>({
    resolver: zodResolver(memberEmailSchema),
    values: { email: currentEmail },
  });

  async function onSubmit(values: MemberEmailFormValues) {
    setIsSubmitting(true);
    try {
      await updateMemberEmailAction(memberId, values.email);
      onUpdated(values.email);
      toast.success("Adresse e-mail mise à jour.");
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Mise à jour impossible.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset({ email: currentEmail });
        onOpenChange(next);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier l&apos;adresse e-mail</DialogTitle>
          <DialogDescription>
            Cette adresse est utilisée pour la connexion — le membre devra l&apos;utiliser dès sa prochaine connexion.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="member-email">Adresse e-mail</Label>
            <Input id="member-email" type="email" aria-invalid={!!errors.email} {...register("email")} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <DialogFooter>
            <AppButton type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </AppButton>
            <AppButton type="submit" isLoading={isSubmitting}>
              Enregistrer
            </AppButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
