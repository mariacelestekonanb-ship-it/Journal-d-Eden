import { UserPlus } from "lucide-react";
import Link from "next/link";

import { AppPageHeader } from "@/shared/components/app-page-header";
import { Button } from "@/shared/ui/button";

import type { MemberPermissions } from "../utils/member-permissions";

export interface MemberHeaderProps {
  permissions: MemberPermissions;
  pendingCount: number;
}

/** En-tête de la page Membres : titre, description, lien vers les demandes en attente si autorisé. */
export function MemberHeader({ permissions, pendingCount }: MemberHeaderProps) {
  return (
    <AppPageHeader
      title="Membres"
      description="Conducteurs de prière et administrateurs de l'EJP — adhésions, rôles et suivi."
      actions={
        permissions.canValidate ? (
          <Button asChild variant={pendingCount > 0 ? "default" : "outline"}>
            <Link href="/administration/membres/demandes">
              <UserPlus className="size-4" />
              Demandes en attente
              {pendingCount > 0 && ` (${pendingCount})`}
            </Link>
          </Button>
        ) : undefined
      }
    />
  );
}
