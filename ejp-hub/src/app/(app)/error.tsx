"use client";

import { AlertTriangleIcon } from "lucide-react";
import * as React from "react";

import { AppButton } from "@/shared/components/app-button";
import { AppEmptyState } from "@/shared/components/app-empty-state";

export interface AppErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error Boundary du groupe (app) — capte toute exception non gérée levée par
 * un Server ou Client Component sous le shell authentifié, sans faire
 * disparaître la sidebar/le header (le layout parent continue de s'afficher
 * autour de ce fallback).
 */
export default function AppError({ error, reset }: AppErrorProps) {
  React.useEffect(() => {
    console.error("Erreur non gérée dans l'application :", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <AppEmptyState
        icon={AlertTriangleIcon}
        title="Une erreur est survenue"
        description="Quelque chose s'est mal passé. Vous pouvez réessayer, ou revenir plus tard si le problème persiste."
        action={<AppButton onClick={reset}>Réessayer</AppButton>}
      />
    </div>
  );
}
