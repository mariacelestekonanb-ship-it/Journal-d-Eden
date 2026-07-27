import { notFound } from "next/navigation";

import {
  analysesRepository,
  categoriesRepository,
} from "@/lib/admin/repository";
import { AnalyseForm } from "@/app/admin/veille/[id]/analyse-form";

interface AnalyseAdminPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: AnalyseAdminPageProps) {
  const { id } = await params;
  if (id === "nouveau") return { title: "Nouvelle analyse" };
  const analyse = await analysesRepository.get(id);
  return { title: analyse?.titre ?? "Analyse" };
}

export default async function AnalyseAdminPage({
  params,
}: AnalyseAdminPageProps) {
  const { id } = await params;
  const categories = await categoriesRepository.list();

  if (id === "nouveau") {
    return <AnalyseForm analyse={null} categories={categories} />;
  }

  const analyse = await analysesRepository.get(id);
  if (!analyse) notFound();

  return <AnalyseForm analyse={analyse} categories={categories} />;
}
