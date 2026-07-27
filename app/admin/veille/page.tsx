import { analysesRepository } from "@/lib/admin/repository";
import { VeilleList } from "@/app/admin/veille/veille-list";

export const metadata = { title: "Veille juridique" };

export default async function VeillePage() {
  const analyses = await analysesRepository.list();
  return <VeilleList items={analyses} />;
}
