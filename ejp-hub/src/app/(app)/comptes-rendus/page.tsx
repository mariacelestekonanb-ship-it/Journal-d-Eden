import type { Metadata } from "next";

import { ReportsView } from "@/features/reports/components/reports-view";

export const metadata: Metadata = {
  title: "Comptes rendus",
};

export default function ComptesRendusPage() {
  return <ReportsView />;
}
