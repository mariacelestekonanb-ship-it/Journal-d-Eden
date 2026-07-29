import { BookOpen, Flame, HandHeart, Megaphone, Sparkles, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Separator } from "@/shared/ui/separator";
import { formatDate, formatTime } from "@/shared/utils/format";

import type { BibleReference, Report } from "../types/report.types";

function ReferenceList({ references }: { references: BibleReference[] }) {
  if (references.length === 0) {
    return <p className="text-sm italic text-muted-foreground">Aucune référence renseignée.</p>;
  }
  return (
    <ul className="space-y-1.5">
      {references.map((reference) => (
        <li key={reference.id} className="flex items-start gap-2 text-sm text-foreground">
          <BookOpen className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
          {reference.reference}
        </li>
      ))}
    </ul>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-2 print:break-inside-avoid">
      <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-foreground">
        <Icon className="size-4 text-primary" aria-hidden="true" />
        {title}
      </h3>
      <div className="pl-6">{children}</div>
    </section>
  );
}

export interface ReportSummaryProps {
  report: Report;
}

/**
 * Reconstitue le compte rendu exactement comme il sera lu — le déroulé réel
 * d'une chaîne de prière de l'EJP, dans son ordre fixe, pas une liste de
 * champs. Pensée pour être imprimable (voir `ReportExportService.print`).
 */
export function ReportSummary({ report }: ReportSummaryProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-base font-semibold text-foreground">
        <Flame className="size-5 text-primary" aria-hidden="true" />
        Chaîne de prière
      </div>

      <Section icon={Users} title="Informations générales">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-xs text-muted-foreground">Date</dt>
            <dd className="font-medium text-foreground">{formatDate(report.generalInfo.date, "EEEE d MMMM yyyy")}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Horaires</dt>
            <dd className="font-medium text-foreground">
              {formatTime(report.generalInfo.startTime)}–{formatTime(report.generalInfo.endTime)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Personnes connectées</dt>
            <dd className="font-medium text-foreground">{report.generalInfo.connectedCount ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Instrumental</dt>
            <dd className="font-medium text-foreground">{report.generalInfo.hasInstrumental ? "Oui" : "Non"}</dd>
          </div>
        </dl>
      </Section>

      <Separator />

      <Section icon={HandHeart} title="Actions de grâce">
        <ReferenceList references={report.thanksgiving} />
      </Section>

      <Separator />

      <Section icon={Sparkles} title="Invitation du Saint-Esprit">
        <ReferenceList references={report.holySpiritInvitation} />
      </Section>

      <Separator />

      <section className="space-y-3 print:break-inside-avoid">
        <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-foreground">
          <BookOpen className="size-4 text-primary" aria-hidden="true" />
          Points de prière
        </h3>
        {report.prayerPoints.length === 0 ? (
          <p className="pl-6 text-sm italic text-muted-foreground">Aucun point de prière renseigné.</p>
        ) : (
          <ol className="space-y-4 pl-6">
            {report.prayerPoints.map((point, index) => (
              <li key={point.id} className="space-y-1.5 print:break-inside-avoid">
                <p className="text-sm font-medium text-foreground">
                  Point {index + 1} — {point.title}
                </p>
                <div className="pl-4">
                  <ReferenceList references={point.references} />
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      <Separator />

      <Section icon={HandHeart} title="Fin / Actions de grâce">
        <ReferenceList references={report.closingThanksgiving} />
      </Section>

      <Separator />

      <Section icon={Megaphone} title="Annonces">
        <p className="whitespace-pre-wrap text-sm text-foreground">
          {report.announcements.trim() ? report.announcements : "Aucune annonce."}
        </p>
      </Section>
    </div>
  );
}
