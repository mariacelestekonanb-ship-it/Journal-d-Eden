import type { Metadata } from "next";

import { ReportCreateView } from "@/features/reports";
import { resolveProfile } from "@/shared/lib/auth/resolve-profile";

export const metadata: Metadata = {
  title: "Nouveau compte rendu",
};

export default async function NouveauCompteRenduPage() {
  const profile = await resolveProfile();

  return <ReportCreateView role={profile.role} />;
}
