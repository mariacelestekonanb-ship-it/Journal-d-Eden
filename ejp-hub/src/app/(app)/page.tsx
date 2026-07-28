import type { Metadata } from "next";

import { DashboardView } from "@/features/dashboard";
import { resolveProfile } from "@/shared/lib/auth/resolve-profile";

export const metadata: Metadata = {
  title: "Tableau de bord",
};

export default async function DashboardPage() {
  const profile = await resolveProfile();

  return <DashboardView profile={profile} />;
}
