export type TimeSlot = "09:00" | "10:00" | "11:00" | "14:00" | "15:00" | "16:00";

export type AppointmentType = "consulta" | "exame";

export type AppointmentStatus = "agendado";

export interface Appointment {
  id: string;
  date: string;        // ISO date string (YYYY-MM-DD)
  slot: TimeSlot;
  type: AppointmentType;
  petId: string;
  status: AppointmentStatus;
}

export const ALL_SLOTS: TimeSlot[] = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

export const BLOCKED_SLOTS_PER_DAY = 2;
