import type { Metadata } from "next";

import { AdminView } from "@/features/admin/components/admin-view";
import { redirectIfMissingRole } from "@/shared/lib/auth/guards";
import { isSupabaseConfigured } from "@/shared/lib/supabase/config";

export const metadata: Metadata = {
  title: "Administration",
};

export default async function AdministrationPage() {
  // Garde-fou de second niveau : le middleware bloque déjà cette route pour
  // les non-administrateurs. En mode démo (Supabase non configuré), la page
  // reste consultable pour prévisualiser le shell.
  if (isSupabaseConfigured()) {
    await redirectIfMissingRole(["ADMIN"]);
  }

  return <AdminView />;
}
