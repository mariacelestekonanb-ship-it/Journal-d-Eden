"use client";

import Link from "next/link";

import { AppLoader } from "@/shared/components/app-loader";
import { ROUTES } from "@/shared/constants/app";

import { useAuth } from "../hooks/use-auth";
import { ResetPasswordForm } from "./reset-password-form";

export function ResetPasswordView() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <AppLoader label="Vérification du lien…" />;
  }

  if (!user) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-muted-foreground">
          Ce lien de réinitialisation est invalide ou a expiré. Demandez-en un nouveau.
        </p>
        <Link href={ROUTES.forgotPassword} className="text-sm font-medium text-primary hover:underline">
          Retour à « mot de passe oublié »
        </Link>
      </div>
    );
  }

  return <ResetPasswordForm />;
}
