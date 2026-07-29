import type { Metadata } from "next";

import { ResetPasswordView } from "@/features/auth";

export const metadata: Metadata = {
  title: "Réinitialiser le mot de passe",
};

export default function ReinitialiserMotDePassePage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-xl font-semibold tracking-tight">Réinitialiser le mot de passe</h1>
        <p className="text-sm text-muted-foreground">Choisissez un nouveau mot de passe pour votre compte.</p>
      </div>
      <ResetPasswordView />
    </div>
  );
}
