import { AppPageHeader } from "@/shared/components/app-page-header";

import { AdminDashboard } from "../components/admin-dashboard";

/** Centre de gestion de la plateforme, câblé sur `/administration`. */
export function AdminDashboardView() {
  return (
    <div className="space-y-6">
      <AppPageHeader title="Administration" description="Centre de gestion de la plateforme EJP Hub." />
      <AdminDashboard />
    </div>
  );
}
