import { glossaireRepository } from "@/lib/admin/repository";
import { GlossaireList } from "@/app/admin/glossaire/glossaire-list";

export const metadata = { title: "Glossaire" };

export default async function GlossairePage() {
  const termes = await glossaireRepository.list();
  return <GlossaireList items={termes} />;
}
