import { formatDate, formatTime } from "@/lib/format";

import type { PlanningSlotWithRelations } from "../types/planning.types";

export function PlanningPrintView({
  slots,
  rangeLabel,
}: {
  slots: PlanningSlotWithRelations[];
  rangeLabel: string;
}) {
  return (
    <div className="print-only">
      <h1 className="text-lg font-semibold">Planning des temps de prière — EJP Hub</h1>
      <p className="mb-4 text-sm text-muted-foreground capitalize">{rangeLabel}</p>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-black/20 text-left">
            <th className="py-1 pr-2">Date</th>
            <th className="py-1 pr-2">Horaire</th>
            <th className="py-1 pr-2">Conducteur</th>
            <th className="py-1 pr-2">Sujet de prière</th>
            <th className="py-1">Lieu</th>
          </tr>
        </thead>
        <tbody>
          {slots.map((slot) => (
            <tr key={slot.id} className="border-b border-black/10">
              <td className="py-1 pr-2">{formatDate(slot.slot_date, "dd/MM/yyyy")}</td>
              <td className="py-1 pr-2">
                {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
              </td>
              <td className="py-1 pr-2">{slot.conducteur?.full_name ?? "Non assigné"}</td>
              <td className="py-1 pr-2">{slot.topic?.title ?? "—"}</td>
              <td className="py-1">{slot.location ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
