import type { Metadata } from "next";

import { ReportDetailView } from "@/features/reports";
import { resolveProfile } from "@/shared/lib/auth/resolve-profile";

export const metadata: Metadata = {
  title: "Compte rendu",
};

export default async function CompteRenduDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await resolveProfile();

  return <ReportDetailView role={profile.role} reportId={id} />;
}
