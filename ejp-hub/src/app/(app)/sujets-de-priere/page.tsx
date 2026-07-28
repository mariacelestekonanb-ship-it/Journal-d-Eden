import type { Metadata } from "next";

import { PrayerTopicsView } from "@/features/prayer-topics/components/prayer-topics-view";

export const metadata: Metadata = {
  title: "Sujets de prière",
};

export default function SujetsDePrierePage() {
  return <PrayerTopicsView />;
}
