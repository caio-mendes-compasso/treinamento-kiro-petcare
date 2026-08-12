import { TimeSlot, ALL_SLOTS } from "@/types/agenda";

/** Returns days in a month (0-indexed month) */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/** Returns the weekday (0=Sun, 6=Sat) of the first day of the month */
export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

/** Calendar day data for grid rendering */
export interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
  dateString: string; // YYYY-MM-DD
}

/** Generates calendar grid data for a given month */
export function generateCalendarGrid(year: number, month: number): CalendarDay[] {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const days: CalendarDay[] = [];

  // Leading empty cells for alignment
  for (let i = 0; i < firstDay; i++) {
    days.push({ date: 0, isCurrentMonth: false, isToday: false, isPast: true, dateString: "" });
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const isPast = dateString < todayStr;
    const isToday = dateString === todayStr;

    days.push({ date: day, isCurrentMonth: true, isToday, isPast, dateString });
  }

  return days;
}

/** Generates 2 random blocked slots for a given date (deterministic per date) */
export function getBlockedSlots(dateString: string): TimeSlot[] {
  // Simple hash-based deterministic random from date string
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    hash = ((hash << 5) - hash) + dateString.charCodeAt(i);
    hash |= 0;
  }

  const indices: number[] = [];
  const idx1 = Math.abs(hash) % ALL_SLOTS.length;
  indices.push(idx1);

  let idx2 = Math.abs(hash >> 3) % ALL_SLOTS.length;
  while (idx2 === idx1) {
    idx2 = (idx2 + 1) % ALL_SLOTS.length;
  }
  indices.push(idx2);

  return indices.map((i) => ALL_SLOTS[i]);
}

/** Gets the month name in Portuguese */
export function getMonthName(month: number): string {
  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ];
  return months[month];
}

/** Navigates to previous month */
export function getPreviousMonth(year: number, month: number): { year: number; month: number } {
  if (month === 0) return { year: year - 1, month: 11 };
  return { year, month: month - 1 };
}

/** Navigates to next month */
export function getNextMonth(year: number, month: number): { year: number; month: number } {
  if (month === 11) return { year: year + 1, month: 0 };
  return { year, month: month + 1 };
}
