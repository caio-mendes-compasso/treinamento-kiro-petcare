import { Appointment } from "@/types/agenda";

const STORAGE_KEY = "petcare_appointments";

export function loadAppointments(): Appointment[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // localStorage unavailable or parse error
  }
  return [];
}

export function saveAppointments(appointments: Appointment[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  } catch {
    // localStorage unavailable
  }
}
