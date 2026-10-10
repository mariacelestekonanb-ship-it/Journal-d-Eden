import type { Metadata } from "next";
import { Lock } from "lucide-react";

import { Logo } from "@/components/shared/logo";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login } from "@/lib/admin/login-actions";
import { siteSettingsStore } from "@/lib/admin/repository";

export const metadata: Metadata = {
  title: "Connexion | Administration",
  robots: { index: false, follow: false },
};

interface AdminLoginPageProps {
  searchParams: Promise<{ next?: string; error?: string }>;
}

/**
 * Page de connexion de l'espace d'administration — volontairement hors du
 * groupe `(dashboard)` (voir `app/admin/(dashboard)/layout.tsx`) pour ne
 * pas afficher la navigation admin avant authentification. Le
 * `middleware.ts` à la racine redirige ici toute visite de `/admin/**`
 * sans session valide.
 */
export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const { next = "/admin", error } = await searchParams;
  const settings = await siteSettingsStore.get();

  return (
    <div className="bg-navy-950 flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex justify-center">
          <Logo inverted logoUrl={settings.branding.logoUrl} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle as="h1" className="flex items-center gap-2">
              <Lock className="text-muted-foreground size-4.5" aria-hidden />
              Connexion
            </CardTitle>
            <CardDescription>
              Entrez le mot de passe de l&apos;espace d&apos;administration.
            </CardDescription>
          </CardHeader>

          <form action={login} className="space-y-4 px-6 pb-6">
            <input type="hidden" name="next" value={next} />

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-foreground text-sm font-medium"
              >
                Mot de passe
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoFocus
                required
                autoComplete="current-password"
              />
            </div>

            {error ? (
              <p role="alert" className="text-destructive text-sm">
                Mot de passe incorrect. Réessayez.
              </p>
            ) : null}

            <Button type="submit" variant="accent" className="w-full">
              Se connecter
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
