import type { Metadata } from "next";

import { requireProfile } from "@/lib/auth/get-current-profile";
import { ReportsView } from "@/features/reports/components/reports-view";

export const metadata: Metadata = {
  title: "Comptes rendus",
};

export default async function ComptesRendusPage() {
  const profile = await requireProfile();

  return <ReportsView userId={profile.id} isAdmin={profile.role === "admin"} />;
}
