import { AppPageHeader } from "@/shared/components/app-page-header";

import { AdminRoles } from "../components/admin-roles";

/** Gestion des rôles, câblée sur `/administration/roles`. */
export function AdminRolesView() {
  return (
    <div className="space-y-6">
      <AppPageHeader title="Rôles" description="Consultez et modifiez le rôle de chaque membre." />
      <AdminRoles />
    </div>
  );
}
