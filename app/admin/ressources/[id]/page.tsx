import { notFound } from "next/navigation";

import { ressourcesRepository } from "@/lib/admin/repository";
import { RessourceForm } from "@/app/admin/ressources/[id]/ressource-form";

interface RessourceAdminPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: RessourceAdminPageProps) {
  const { id } = await params;
  if (id === "nouveau") return { title: "Nouvelle ressource" };
  const ressource = await ressourcesRepository.get(id);
  return { title: ressource?.titre ?? "Ressource" };
}

export default async function RessourceAdminPage({
  params,
}: RessourceAdminPageProps) {
  const { id } = await params;

  if (id === "nouveau") {
    return <RessourceForm ressource={null} />;
  }

  const ressource = await ressourcesRepository.get(id);
  if (!ressource) notFound();

  return <RessourceForm ressource={ressource} />;
}
