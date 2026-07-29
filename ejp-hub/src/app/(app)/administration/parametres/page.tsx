import type { Metadata } from "next";

import { AdminSettingsView } from "@/features/admin";
import { redirectIfMissingRole } from "@/shared/lib/auth/guards";
import { isSupabaseConfigured } from "@/shared/lib/supabase/config";

export const metadata: Metadata = {
  title: "Paramètres — Administration",
};

export default async function AdministrationParametresPage() {
  if (isSupabaseConfigured()) {
    await redirectIfMissingRole(["ADMIN"]);
  }

  return <AdminSettingsView />;
}
