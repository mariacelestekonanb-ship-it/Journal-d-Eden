"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AppButton } from "@/shared/components/app-button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

import { useAuth } from "../hooks/use-auth";
import { updatePassword } from "../services/auth.service";
import { resetPasswordSchema, type ResetPasswordInput } from "../validation/reset-password.schema";

export function ResetPasswordForm() {
  const { signOut } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit(values: ResetPasswordInput) {
    setIsSubmitting(true);
    try {
      await updatePassword(values.password);
      toast.success("Mot de passe mis à jour. Merci de vous reconnecter.");
      await signOut();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Mise à jour impossible.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="space-y-2">
        <Label htmlFor="password">Nouveau mot de passe</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!errors.password}
          {...register("password")}
        />
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!errors.confirmPassword}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
      </div>

      <AppButton type="submit" className="w-full" isLoading={isSubmitting}>
        Mettre à jour le mot de passe
      </AppButton>
    </form>
  );
}
