import type { Metadata } from "next";

import { TestimoniesView } from "@/features/testimonies";
import { resolveProfile } from "@/shared/lib/auth/resolve-profile";

export const metadata: Metadata = {
  title: "Témoignages",
};

export default async function TemoignagesPage() {
  const profile = await resolveProfile();

  return <TestimoniesView role={profile.role} />;
}
