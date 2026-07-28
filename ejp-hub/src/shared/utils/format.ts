import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export function formatDate(date: string | Date, pattern = "d MMMM yyyy"): string {
  return format(typeof date === "string" ? new Date(date) : date, pattern, { locale: fr });
}

export function formatDateTime(date: string | Date): string {
  return format(typeof date === "string" ? new Date(date) : date, "d MMMM yyyy 'à' HH:mm", { locale: fr });
}

export function formatTime(time: string): string {
  return time.slice(0, 5);
}

export function formatRelative(date: string | Date): string {
  return formatDistanceToNow(typeof date === "string" ? new Date(date) : date, {
    addSuffix: true,
    locale: fr,
  });
}
