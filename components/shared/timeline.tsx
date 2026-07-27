import { TimelineItem } from "@/components/shared/timeline-item";
import type { EvenementChronologie } from "@/types";

export interface TimelineProps {
  evenements: EvenementChronologie[];
}

/** Chronologie des faits, dans l'ordre : liste de `TimelineItem` reliés par une ligne verticale. */
export function Timeline({ evenements }: TimelineProps) {
  return (
    <ol>
      {evenements.map((evenement, index) => (
        <TimelineItem
          key={index}
          evenement={evenement}
          isLast={index === evenements.length - 1}
        />
      ))}
    </ol>
  );
}
