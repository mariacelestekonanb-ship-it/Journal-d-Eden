import type { Metadata } from "next";

import { requireProfile } from "@/lib/auth/get-current-profile";
import { PlanningView } from "@/features/planning/components/planning-view";

export const metadata: Metadata = {
  title: "Planning",
};

export default async function PlanningPage() {
  const profile = await requireProfile();

  return <PlanningView isAdmin={profile.role === "admin"} />;
}
