import type { Metadata } from "next";

import { PlanningView } from "@/features/planning";
import { resolveProfile } from "@/shared/lib/auth/resolve-profile";

export const metadata: Metadata = {
  title: "Planning",
};

export default async function PlanningPage() {
  const profile = await resolveProfile();

  return <PlanningView role={profile.role} />;
}
