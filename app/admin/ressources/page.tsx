import { ressourcesRepository } from "@/lib/admin/repository";
import { RessourcesList } from "@/app/admin/ressources/ressources-list";

export const metadata = { title: "Ressources" };

export default async function RessourcesAdminPage() {
  const ressources = await ressourcesRepository.list();
  return <RessourcesList items={ressources} />;
}
