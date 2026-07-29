import type { Metadata } from "next";

import { AdminRolesView } from "@/features/admin";
import { redirectIfMissingRole } from "@/shared/lib/auth/guards";
import { isSupabaseConfigured } from "@/shared/lib/supabase/config";

export const metadata: Metadata = {
  title: "Rôles — Administration",
};

export default async function AdministrationRolesPage() {
  if (isSupabaseConfigured()) {
    await redirectIfMissingRole(["ADMIN"]);
  }

  return <AdminRolesView />;
}
