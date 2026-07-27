import { notFound } from "next/navigation";

import { glossaireRepository } from "@/lib/admin/repository";
import { TermeForm } from "@/app/admin/glossaire/[id]/terme-form";

interface TermeAdminPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: TermeAdminPageProps) {
  const { id } = await params;
  if (id === "nouveau") return { title: "Nouveau terme" };
  const terme = await glossaireRepository.get(id);
  return { title: terme?.terme ?? "Terme" };
}

export default async function TermeAdminPage({ params }: TermeAdminPageProps) {
  const { id } = await params;

  if (id === "nouveau") {
    return <TermeForm terme={null} />;
  }

  const terme = await glossaireRepository.get(id);
  if (!terme) notFound();

  return <TermeForm terme={terme} />;
}
