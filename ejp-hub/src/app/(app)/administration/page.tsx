import type { Metadata } from "next";

import { AdminView } from "@/features/admin/components/admin-view";

export const metadata: Metadata = {
  title: "Administration",
};

export default function AdministrationPage() {
  return <AdminView />;
}
