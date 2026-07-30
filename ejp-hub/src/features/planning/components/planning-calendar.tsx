"use client";

import dayGridPlugin from "@fullcalendar/daygrid";
import frLocale from "@fullcalendar/core/locales/fr";
import interactionPlugin from "@fullcalendar/interaction";
import multiMonthPlugin from "@fullcalendar/multimonth";
import FullCalendar from "@fullcalendar/react";
import type { EventClickArg, EventDropArg } from "@fullcalendar/core";
import type { EventResizeDoneArg } from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import * as React from "react";

import type { PrayerSlot, PlanningViewMode } from "../types/planning.types";
import { buildCalendarEvents } from "../utils/build-calendar-events";
import type { PlanningPermissions } from "../utils/planning-permissions";
import { PlanningEvent } from "./planning-event";

import "./planning-calendar.css";

const VIEW_TO_FULLCALENDAR: Record<Exclude<PlanningViewMode, "list" | "programs">, string> = {
  overview: "multiMonthThreeMonth",
  week: "timeGridWeek",
  month: "dayGridMonth",
};

export interface PlanningCalendarProps {
  slots: PrayerSlot[];
  view: Exclude<PlanningViewMode, "list" | "programs">;
  permissions: PlanningPermissions;
  onSlotClick: (slot: PrayerSlot) => void;
  onDateClick: (dateStr: string) => void;
  onReschedule: (id: string, schedule: { date: string; startTime: string; endTime: string }) => Promise<unknown>;
}

/**
 * Calendrier du Planning (FullCalendar) : vues Calendrier (aperçu trimestriel),
 * Semaine et Mois. Glisser-déposer et redimensionnement réservés aux
 * utilisateurs autorisés (voir `getPlanningPermissions`).
 */
export function PlanningCalendar({ slots, view, permissions, onSlotClick, onDateClick, onReschedule }: PlanningCalendarProps) {
  const events = React.useMemo(() => buildCalendarEvents(slots), [slots]);
  const fullCalendarView = VIEW_TO_FULLCALENDAR[view];

  function handleEventClick(arg: EventClickArg) {
    const slot = arg.event.extendedProps.slot as PrayerSlot;
    onSlotClick(slot);
  }

  async function handleEventDrop(arg: EventDropArg) {
    const { start, end } = arg.event;
    if (!start || !end) return arg.revert();

    try {
      await onReschedule(arg.event.id, {
        date: start.toISOString().slice(0, 10),
        startTime: start.toTimeString().slice(0, 5),
        endTime: end.toTimeString().slice(0, 5),
      });
    } catch {
      arg.revert();
    }
  }

  async function handleEventResize(arg: EventResizeDoneArg) {
    const { start, end } = arg.event;
    if (!start || !end) return arg.revert();

    try {
      await onReschedule(arg.event.id, {
        date: start.toISOString().slice(0, 10),
        startTime: start.toTimeString().slice(0, 5),
        endTime: end.toTimeString().slice(0, 5),
      });
    } catch {
      arg.revert();
    }
  }

  return (
    <div className="planning-calendar">
      <FullCalendar
        key={fullCalendarView}
        plugins={[dayGridPlugin, timeGridPlugin, multiMonthPlugin, interactionPlugin]}
        views={{ multiMonthThreeMonth: { type: "multiMonth", duration: { months: 3 }, titleFormat: { year: "numeric", month: "long" } } }}
        initialView={fullCalendarView}
        locale={frLocale}
        firstDay={1}
        headerToolbar={{ left: "prev,next today", center: "title", right: "" }}
        height="auto"
        events={events}
        eventContent={(arg) => (
          <PlanningEvent
            slot={arg.event.extendedProps.slot as PrayerSlot}
            timeText={arg.timeText}
            compact={arg.view.type !== "timeGridWeek"}
          />
        )}
        eventClick={handleEventClick}
        dateClick={(arg) => permissions.canCreate && onDateClick(arg.dateStr.slice(0, 10))}
        editable={permissions.canDragAndDrop}
        eventStartEditable={permissions.canDragAndDrop}
        eventDurationEditable={permissions.canDragAndDrop}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        dayMaxEvents={3}
        nowIndicator
      />
    </div>
  );
}
