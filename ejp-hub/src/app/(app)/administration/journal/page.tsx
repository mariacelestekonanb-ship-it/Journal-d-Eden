import type { Metadata } from "next";

import { AdminAuditLogView } from "@/features/admin";
import { redirectIfMissingRole } from "@/shared/lib/auth/guards";
import { isSupabaseConfigured } from "@/shared/lib/supabase/config";

export const metadata: Metadata = {
  title: "Journal — Administration",
};

export default async function AdministrationJournalPage() {
  if (isSupabaseConfigured()) {
    await redirectIfMissingRole(["ADMIN"]);
  }

  return <AdminAuditLogView />;
}
