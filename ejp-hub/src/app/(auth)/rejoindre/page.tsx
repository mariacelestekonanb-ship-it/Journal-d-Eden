import type { Metadata } from "next";

import { MemberJoinView } from "@/features/members";

export const metadata: Metadata = {
  title: "Rejoindre les Conducteurs de prière",
};

export default function RejoindrePage() {
  return <MemberJoinView />;
}
