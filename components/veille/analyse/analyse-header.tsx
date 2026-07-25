import { Clock, CalendarDays, CalendarClock } from "lucide-react";

import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { Tag } from "@/components/ui/tag";
import { CategoryBadge } from "@/components/veille/category-badge";
import { InstitutionBadge } from "@/components/veille/institution-badge";
import { ShareButtons } from "@/components/shared/share-buttons";
import { formatDate } from "@/lib/format";
import type { VeilleItem } from "@/types";

export interface AnalyseHeaderProps {
  item: VeilleItem;
  url: string;
}

/** En-tête d'une analyse : catégorie, institution, dates, temps de lecture, titre, résumé et partage. */
export function AnalyseHeader({ item, url }: AnalyseHeaderProps) {
  const aEteMiseAJour = item.dateMiseAJour !== item.date;

  return (
    <header>
      <div className="flex flex-wrap items-center gap-2">
        <CategoryBadge domaine={item.domaine} />
        <Tag>{item.type}</Tag>
        <InstitutionBadge institution={item.source} />
      </div>

      <Heading as="h1" size="xl" className="mt-5">
        {item.titre}
      </Heading>

      <Paragraph size="lg" tone="muted" className="mt-4 max-w-2xl text-balance">
        {item.resume}
      </Paragraph>

      <div className="text-muted-foreground mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium">
        <span className="flex items-center gap-1.5">
          <CalendarDays className="size-3.5" aria-hidden />
          Publié le {formatDate(item.date)}
        </span>
        {aEteMiseAJour ? (
          <span className="flex items-center gap-1.5">
            <CalendarClock className="size-3.5" aria-hidden />
            Mis à jour le {formatDate(item.dateMiseAJour)}
          </span>
        ) : null}
        <span className="flex items-center gap-1.5">
          <Clock className="size-3.5" aria-hidden />
          {item.tempsLecture} min de lecture
        </span>
      </div>

      <div className="mt-6">
        <ShareButtons url={url} title={item.titre} />
      </div>
    </header>
  );
}
