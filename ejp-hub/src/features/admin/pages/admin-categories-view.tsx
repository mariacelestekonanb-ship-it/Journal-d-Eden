import { AppPageHeader } from "@/shared/components/app-page-header";

import { AdminCategoryManager } from "../components/admin-category-manager";

/** Gestion des catégories configurables, câblée sur `/administration/categories`. */
export function AdminCategoriesView() {
  return (
    <div className="space-y-6">
      <AppPageHeader title="Catégories" description="Listes configurables de la plateforme (catégories de sujets, types de réunion)." />
      <AdminCategoryManager />
    </div>
  );
}
