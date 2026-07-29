import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { signOutAction } from "@/features/auth";
import { getCurrentProfile } from "@/shared/lib/auth/get-current-profile";
import { isSupabaseConfigured } from "@/shared/lib/supabase/config";
import { Button } from "@/shared/ui/button";

export const metadata: Metadata = {
  title: "Compte en attente",
};

const STATUS_MESSAGES: Partial<Record<string, { title: string; description: string }>> = {
  PENDING: {
    title: "Votre demande est en attente",
    description:
      "Un administrateur doit encore examiner votre demande d'adhésion. Vous pourrez accéder à l'application dès qu'elle sera acceptée.",
  },
  REFUSED: {
    title: "Votre demande a été refusée",
    description: "Un administrateur a refusé votre demande d'adhésion. Contactez l'EJP pour plus d'informations.",
  },
  SUSPENDED: {
    title: "Votre compte est suspendu",
    description: "Un administrateur a suspendu votre compte. Contactez l'EJP pour plus d'informations.",
  },
};

/**
 * Page vue par un utilisateur authentifié dont le compte n'est pas (encore,
 * ou plus) `ACTIVE` — voir `middleware.ts`, qui redirige ici quel que soit le
 * statut tant qu'il n'est pas `ACTIVE`. Sans cette page (et le blocage
 * middleware qui y mène), une demande d'adhésion `PENDING` pourrait utiliser
 * normalement l'application dès sa création, alors qu'elle possède déjà un
 * compte et un mot de passe valides côté Supabase Auth.
 */
export default async function CompteEnAttentePage() {
  if (!isSupabaseConfigured()) {
    redirect("/");
  }

  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/connexion");
  }
  if (profile.status === "ACTIVE") {
    redirect("/");
  }

  const message = STATUS_MESSAGES[profile.status] ?? STATUS_MESSAGES.PENDING!;

  return (
    <div className="space-y-5 text-center">
      <h1 className="text-xl font-semibold tracking-tight">{message.title}</h1>
      <p className="text-sm text-muted-foreground">{message.description}</p>
      <form action={signOutAction}>
        <Button type="submit" variant="outline" className="w-full">
          Se déconnecter
        </Button>
      </form>
    </div>
  );
}
