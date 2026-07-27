import { notFound } from "next/navigation";

import { categoriesRepository, fichesRepository } from "@/lib/admin/repository";
import { FicheForm } from "@/app/admin/fiches/[id]/fiche-form";

interface FicheAdminPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: FicheAdminPageProps) {
  const { id } = await params;
  if (id === "nouveau") return { title: "Nouvelle fiche" };
  const fiche = await fichesRepository.get(id);
  return { title: fiche?.question ?? "Fiche" };
}

/**
 * `id === "nouveau"` signale la création plutôt qu'une route séparée : un
 * seul gabarit (`FicheForm`) pour créer et modifier, comme le reste de
 * l'admin.
 */
export default async function FicheAdminPage({ params }: FicheAdminPageProps) {
  const { id } = await params;
  const categories = await categoriesRepository.list();

  if (id === "nouveau") {
    return <FicheForm fiche={null} categories={categories} />;
  }

  const fiche = await fichesRepository.get(id);
  if (!fiche) notFound();

  return <FicheForm fiche={fiche} categories={categories} />;
}
