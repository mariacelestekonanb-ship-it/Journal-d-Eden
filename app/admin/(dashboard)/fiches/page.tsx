import { fichesRepository } from "@/lib/admin/repository";
import { FichesList } from "@/app/admin/(dashboard)/fiches/fiches-list";

export const metadata = { title: "Fiches" };

export default async function FichesPage() {
  const fiches = await fichesRepository.list();
  return <FichesList items={fiches} />;
}
