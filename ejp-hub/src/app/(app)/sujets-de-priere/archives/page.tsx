import type { Metadata } from "next";

import { PrayerTopicsArchiveView } from "@/features/prayer-topics";
import { resolveProfile } from "@/shared/lib/auth/resolve-profile";

export const metadata: Metadata = {
  title: "Archives — Sujets de prière",
};

export default async function SujetsDePriereArchivesPage() {
  const profile = await resolveProfile();

  return <PrayerTopicsArchiveView role={profile.role} />;
}
