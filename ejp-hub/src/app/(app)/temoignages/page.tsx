import type { Metadata } from "next";

import { requireProfile } from "@/lib/auth/get-current-profile";
import { TestimoniesView } from "@/features/testimonies/components/testimonies-view";

export const metadata: Metadata = {
  title: "Témoignages",
};

export default async function TemoignagesPage() {
  const profile = await requireProfile();

  return <TestimoniesView userId={profile.id} isAdmin={profile.role === "admin"} />;
}
