import { Plus } from "lucide-react";
import Link from "next/link";

import { AppPageHeader } from "@/shared/components/app-page-header";
import { Button } from "@/shared/ui/button";

import type { ReportPermissions } from "../utils/report-permissions";

export interface ReportHeaderProps {
  permissions: ReportPermissions;
}

/** En-tête de la page Comptes rendus : titre, description, création si autorisée. */
export function ReportHeader({ permissions }: ReportHeaderProps) {
  return (
    <AppPageHeader
      title="Comptes rendus"
      description="Chaque conducteur rédige le compte rendu de ses propres créneaux de prière."
      actions={
        permissions.canCreate ? (
          <Button asChild>
            <Link href="/comptes-rendus/nouveau">
              <Plus className="size-4" />
              Nouveau compte rendu
            </Link>
          </Button>
        ) : undefined
      }
    />
  );
}
