import type { Metadata } from "next";

import { TestimoniesView } from "@/features/testimonies/components/testimonies-view";

export const metadata: Metadata = {
  title: "Témoignages",
};

export default function TemoignagesPage() {
  return <TestimoniesView />;
}
