import type { Metadata } from "next";

import { requireProfile } from "@/lib/auth/get-current-profile";
import { ProfileView } from "@/features/profile/components/profile-view";

export const metadata: Metadata = {
  title: "Mon profil",
};

export default async function MonProfilPage() {
  const profile = await requireProfile();

  return <ProfileView profile={profile} />;
}
