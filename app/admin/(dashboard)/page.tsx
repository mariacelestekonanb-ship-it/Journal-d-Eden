import {
  BookOpen,
  Newspaper,
  BookMarked,
  FolderOpen,
  CheckCircle2,
  FileEdit,
} from "lucide-react";

import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { StatCard } from "@/components/admin/dashboard/stat-card";
import { RecentContentList } from "@/components/admin/dashboard/recent-content-list";
import { ActivityFeed } from "@/components/admin/dashboard/activity-feed";
import { getAllAdminContent } from "@/lib/admin/content";
import { getRecentActivity } from "@/lib/admin/activity-log";
import type { AdminEntityType } from "@/lib/admin/types";

export const metadata = { title: "Tableau de bord" };

/**
 * Page d'accueil de l'admin : compteurs par type, contenu récemment
 * modifié et activité de l'équipe éditoriale, tous dérivés d'une seule
 * lecture homogène des cinq dépôts (`getAllAdminContent`).
 */
export default async function AdminDashboardPage() {
  const [contenu, activite] = await Promise.all([
    getAllAdminContent(),
    getRecentActivity(8),
  ]);

  const compte = (entity: AdminEntityType) =>
    contenu.filter((item) => item.entity === entity).length;
  const publies = contenu.filter((item) => item.status === "publie").length;
  const brouillons = contenu.filter(
    (item) => item.status === "brouillon",
  ).length;

  const recents = [...contenu]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 6);

  return (
    <div className="space-y-8">
      <div>
        <Heading as="h1" size="lg">
          Tableau de bord
        </Heading>
        <Paragraph tone="muted" className="mt-1">
          Vue d&apos;ensemble du contenu de LexWatch.
        </Paragraph>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard icon={BookOpen} label="Fiches" value={compte("fiche")} />
        <StatCard icon={Newspaper} label="Analyses" value={compte("analyse")} />
        <StatCard
          icon={BookMarked}
          label="Termes"
          value={compte("glossaire")}
        />
        <StatCard
          icon={FolderOpen}
          label="Ressources"
          value={compte("ressource")}
        />
        <StatCard
          icon={CheckCircle2}
          label="Publiés"
          value={publies}
          tone="navy"
        />
        <StatCard icon={FileEdit} label="Brouillons" value={brouillons} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentContentList items={recents} />
        <ActivityFeed entries={activite} />
      </div>
    </div>
  );
}
