import { categoriesRepository } from "@/lib/admin/repository";
import { CategoriesList } from "@/app/admin/(dashboard)/categories/categories-list";

export const metadata = { title: "Catégories" };

export default async function CategoriesPage() {
  const categories = await categoriesRepository.list();
  return <CategoriesList items={categories} />;
}
