import type { Metadata } from "next";

import { MemberSelfProfileView } from "@/features/members";

export const metadata: Metadata = {
  title: "Mon profil",
};

export default function MonProfilPage() {
  return <MemberSelfProfileView />;
}
