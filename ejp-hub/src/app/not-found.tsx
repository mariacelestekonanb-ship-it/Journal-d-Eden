import { CompassIcon } from "lucide-react";
import Link from "next/link";

import { ROUTES } from "@/shared/constants/app";
import { Button } from "@/shared/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted">
        <CompassIcon className="size-7 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Page introuvable</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Cette page n&apos;existe pas ou a été déplacée. Vérifiez l&apos;adresse ou revenez à l&apos;accueil.
        </p>
      </div>
      <Button asChild>
        <Link href={ROUTES.dashboard}>Retour à l&apos;accueil</Link>
      </Button>
    </div>
  );
}
