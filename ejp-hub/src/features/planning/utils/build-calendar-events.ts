import type { EventInput } from "@fullcalendar/core";

import type { PrayerSlot } from "../types/planning.types";

/** Convertit les créneaux en événements FullCalendar — la couleur est pilotée par CSS (voir planning-calendar.css). */
export function buildCalendarEvents(slots: PrayerSlot[]): EventInput[] {
  return slots.map((slot) => ({
    id: slot.id,
    title: slot.title,
    start: `${slot.date}T${slot.startTime}`,
    end: `${slot.date}T${slot.endTime}`,
    classNames: ["planning-event", `planning-event--${slot.status.toLowerCase()}`],
    extendedProps: { slot },
  }));
}
