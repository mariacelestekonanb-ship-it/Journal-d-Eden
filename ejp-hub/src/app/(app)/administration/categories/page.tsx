import type { Metadata } from "next";

import { AdminCategoriesView } from "@/features/admin";
import { redirectIfMissingRole } from "@/shared/lib/auth/guards";
import { isSupabaseConfigured } from "@/shared/lib/supabase/config";

export const metadata: Metadata = {
  title: "Catégories — Administration",
};

export default async function AdministrationCategoriesPage() {
  if (isSupabaseConfigured()) {
    await redirectIfMissingRole(["ADMIN"]);
  }

  return <AdminCategoriesView />;
}
