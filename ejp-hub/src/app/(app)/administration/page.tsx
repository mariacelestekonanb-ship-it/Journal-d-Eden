import type { Metadata } from "next";

import { requireAdminProfile } from "@/lib/auth/get-current-profile";
import { AdminView } from "@/features/admin/components/admin-view";

export const metadata: Metadata = {
  title: "Administration",
};

export default async function AdministrationPage() {
  const profile = await requireAdminProfile();

  return <AdminView currentUserId={profile.id} />;
}
