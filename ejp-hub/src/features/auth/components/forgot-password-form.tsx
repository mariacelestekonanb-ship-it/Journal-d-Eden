"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { requestPasswordReset } from "@/features/auth/services/auth.service";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/features/auth/validation/forgot-password.schema";
import { AppButton } from "@/shared/components/app-button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

export function ForgotPasswordForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSent, setIsSent] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgotPasswordInput) {
    setIsSubmitting(true);
    try {
      await requestPasswordReset(values.email);
      setIsSent(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Envoi impossible.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSent) {
    return (
      <p className="rounded-md bg-accent p-4 text-sm text-accent-foreground">
        Si un compte existe avec cette adresse, un e-mail de réinitialisation vient de vous être envoyé.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="space-y-2">
        <Label htmlFor="email">Adresse e-mail</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="vous@ejp.org"
            className="pl-9"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
        </div>
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <AppButton type="submit" className="w-full" isLoading={isSubmitting}>
        Envoyer le lien de réinitialisation
      </AppButton>
    </form>
  );
}
