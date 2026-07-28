import type { Metadata } from "next";

import { PrayerTopicsView } from "@/features/prayer-topics";
import { resolveProfile } from "@/shared/lib/auth/resolve-profile";

export const metadata: Metadata = {
  title: "Sujets de prière",
};

export default async function SujetsDePrierePage() {
  const profile = await resolveProfile();

  return <PrayerTopicsView role={profile.role} />;
}
