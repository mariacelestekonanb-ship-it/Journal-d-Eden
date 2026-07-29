import type { Metadata } from "next";

import { ReportsView } from "@/features/reports";
import { resolveProfile } from "@/shared/lib/auth/resolve-profile";

export const metadata: Metadata = {
  title: "Comptes rendus",
};

export default async function ComptesRendusPage() {
  const profile = await resolveProfile();

  return <ReportsView role={profile.role} />;
}
