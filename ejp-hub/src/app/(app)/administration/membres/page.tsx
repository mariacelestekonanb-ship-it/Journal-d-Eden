import type { Metadata } from "next";

import { MembersView } from "@/features/members";
import { redirectIfMissingRole } from "@/shared/lib/auth/guards";
import { isSupabaseConfigured } from "@/shared/lib/supabase/config";
import { resolveProfile } from "@/shared/lib/auth/resolve-profile";

export const metadata: Metadata = {
  title: "Membres — Administration",
};

export default async function AdministrationMembresPage() {
  // Garde-fou de second niveau : le middleware bloque déjà cette route pour
  // les non-administrateurs. En mode démo (Supabase non configuré), la page
  // reste consultable pour prévisualiser le shell.
  if (isSupabaseConfigured()) {
    await redirectIfMissingRole(["ADMIN"]);
  }

  const profile = await resolveProfile();

  return <MembersView role={profile.role} />;
}
