import { AppPageHeader } from "@/shared/components/app-page-header";

import { AdminAuditLog } from "../components/admin-audit-log";

/** Journal d'administration, câblé sur `/administration/journal`. */
export function AdminAuditLogView() {
  return (
    <div className="space-y-6">
      <AppPageHeader title="Journal d'administration" description="Historique des actions notables de la plateforme." />
      <AdminAuditLog />
    </div>
  );
}
