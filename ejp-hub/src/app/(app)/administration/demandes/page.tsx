import type { Metadata } from "next";

import { MemberRequestsView } from "@/features/members";
import { redirectIfMissingRole } from "@/shared/lib/auth/guards";
import { isSupabaseConfigured } from "@/shared/lib/supabase/config";

export const metadata: Metadata = {
  title: "Demandes d'adhésion",
};

export default async function AdministrationDemandesPage() {
  if (isSupabaseConfigured()) {
    await redirectIfMissingRole(["ADMIN"]);
  }

  return <MemberRequestsView />;
}
