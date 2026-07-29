import { AppPageHeader } from "@/shared/components/app-page-header";

import { AdminSettings } from "../components/admin-settings";

/** Paramètres généraux, câblés sur `/administration/parametres`. */
export function AdminSettingsView() {
  return (
    <div className="space-y-6">
      <AppPageHeader title="Paramètres généraux" description="Nom, logo, description, fuseau horaire et langue de la plateforme." />
      <AdminSettings />
    </div>
  );
}
