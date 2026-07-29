import type { Metadata } from "next";

import { ReportEditView } from "@/features/reports";

export const metadata: Metadata = {
  title: "Modifier le compte rendu",
};

export default async function ModifierCompteRenduPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <ReportEditView reportId={id} />;
}
