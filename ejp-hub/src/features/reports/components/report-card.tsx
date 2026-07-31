import { CalendarDays, MapPin, User } from "lucide-react";
import * as React from "react";

import { AppCard, AppCardContent } from "@/shared/components/app-card";
import { formatDate, formatTime } from "@/shared/utils/format";

import type { Report } from "../types/report.types";
import { ReportStatusBadge } from "./report-status-badge";

export interface ReportCardProps {
  report: Report;
  className?: string;
}

function ReportCardComponent({ report, className }: ReportCardProps) {
  return (
    <AppCard className={className}>
      <AppCardContent className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium text-foreground">{report.planningSlot.title}</p>
          <ReportStatusBadge status={report.status} className="shrink-0" />
        </div>

        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <CalendarDays className="size-3.5 shrink-0" aria-hidden="true" />
          {formatDate(report.planningSlot.date, "EEEE d MMMM yyyy")} · {formatTime(report.planningSlot.startTime)}–
          {formatTime(report.planningSlot.endTime)}
        </p>

        {report.planningSlot.location && (
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
            {report.planningSlot.location}
          </p>
        )}

        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <User className="size-3.5 shrink-0" aria-hidden="true" />
          <span className={report.leader.isActive === false ? "italic opacity-60" : undefined}>
            {report.leader.fullName}
          </span>
          {report.authorId !== report.leader.id && ` · rédigé par ${report.authorName}`}
        </p>
      </AppCardContent>
    </AppCard>
  );
}

/** Résumé compact d'un CR — informations du créneau associé, réutilisable (détail, futurs modules). */
export const ReportCard = React.memo(ReportCardComponent);
