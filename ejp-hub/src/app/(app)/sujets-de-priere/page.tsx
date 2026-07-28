import type { Metadata } from "next";

import { requireProfile } from "@/lib/auth/get-current-profile";
import { PrayerTopicsView } from "@/features/prayer-topics/components/prayer-topics-view";

export const metadata: Metadata = {
  title: "Sujets de prière",
};

export default async function SujetsDePrierePage() {
  const profile = await requireProfile();

  return <PrayerTopicsView currentUserId={profile.id} isAdmin={profile.role === "admin"} />;
}
