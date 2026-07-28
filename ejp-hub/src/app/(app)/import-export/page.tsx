import type { Metadata } from "next";

import { requireAdminProfile } from "@/lib/auth/get-current-profile";
import { ImportExportView } from "@/features/import-export/components/import-export-view";

export const metadata: Metadata = {
  title: "Import / Export",
};

export default async function ImportExportPage() {
  await requireAdminProfile();

  return <ImportExportView />;
}
