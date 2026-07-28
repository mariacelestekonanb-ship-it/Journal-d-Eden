import type { Database } from "@/types/database";

export type Report = Database["public"]["Tables"]["reports"]["Row"];

export interface ReportWithSlot extends Report {
  slot: {
    id: string;
    slot_date: string;
    start_time: string;
    end_time: string;
    location: string | null;
    topic: { id: string; title: string } | null;
  };
  conducteur: { id: string; full_name: string };
}

export interface PendingSlot {
  id: string;
  slot_date: string;
  start_time: string;
  end_time: string;
  location: string | null;
  topic: { id: string; title: string } | null;
}
