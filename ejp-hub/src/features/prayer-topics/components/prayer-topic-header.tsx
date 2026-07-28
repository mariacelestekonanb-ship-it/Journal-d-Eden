import { Archive, Plus } from "lucide-react";
import Link from "next/link";

import { AppButton } from "@/shared/components/app-button";
import { AppPageHeader } from "@/shared/components/app-page-header";
import { Button } from "@/shared/ui/button";

import type { PrayerTopicPermissions } from "../utils/prayer-topic-permissions";

export interface PrayerTopicHeaderProps {
  permissions: PrayerTopicPermissions;
  onCreateClick: () => void;
}

/** En-tête de la page Sujets de prière : titre, description, lien vers les archives et création si autorisée. */
export function PrayerTopicHeader({ permissions, onCreateClick }: PrayerTopicHeaderProps) {
  return (
    <AppPageHeader
      title="Sujets de prière"
      description="Créez, organisez et suivez les sujets portés par la communauté."
      actions={
        <>
          <Button asChild variant="outline">
            <Link href="/sujets-de-priere/archives">
              <Archive className="size-4" />
              Archives
            </Link>
          </Button>
          {permissions.canCreate && (
            <AppButton onClick={onCreateClick}>
              <Plus className="size-4" />
              Nouveau sujet
            </AppButton>
          )}
        </>
      }
    />
  );
}
