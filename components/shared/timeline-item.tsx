import { Paragraph } from "@/components/ui/paragraph";
import { formatDate } from "@/lib/format";
import type { EvenementChronologie } from "@/types";

export interface TimelineItemProps {
  evenement: EvenementChronologie;
  isLast?: boolean;
}

/** Un événement daté de la chronologie, relié au suivant par une ligne verticale. */
export function TimelineItem({ evenement, isLast = false }: TimelineItemProps) {
  return (
    <li className="relative flex gap-5 pb-8 last:pb-0">
      {!isLast ? (
        <span
          aria-hidden
          className="bg-border absolute top-3 left-[0.4375rem] h-full w-px"
        />
      ) : null}
      <span
        aria-hidden
        className="bg-accent ring-background relative mt-1.5 size-3.5 shrink-0 rounded-full ring-4"
      />
      <div className="min-w-0 pb-1">
        <time
          dateTime={evenement.date}
          className="text-muted-foreground text-xs font-medium tracking-wide uppercase"
        >
          {formatDate(evenement.date)}
        </time>
        <p className="font-heading text-foreground mt-1 text-sm font-semibold">
          {evenement.titre}
        </p>
        {evenement.description ? (
          <Paragraph tone="muted" size="sm" className="mt-1">
            {evenement.description}
          </Paragraph>
        ) : null}
      </div>
    </li>
  );
}
