import type { Metadata } from "next";

import { MemberDetailView } from "@/features/members";
import { redirectIfMissingRole } from "@/shared/lib/auth/guards";
import { resolveProfile } from "@/shared/lib/auth/resolve-profile";
import { isSupabaseConfigured } from "@/shared/lib/supabase/config";

export const metadata: Metadata = {
  title: "Fiche membre",
};

export default async function AdministrationMembreDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (isSupabaseConfigured()) {
    await redirectIfMissingRole(["ADMIN"]);
  }

  const profile = await resolveProfile();

  return <MemberDetailView role={profile.role} memberId={id} />;
}
