import type { Metadata } from "next";

import { requireProfile } from "@/lib/auth/get-current-profile";
import { DashboardView } from "@/features/dashboard/components/dashboard-view";

export const metadata: Metadata = {
  title: "Tableau de bord",
};

export default async function DashboardPage() {
  const profile = await requireProfile();

  return <DashboardView userId={profile.id} isAdmin={profile.role === "admin"} fullName={profile.full_name} />;
}
