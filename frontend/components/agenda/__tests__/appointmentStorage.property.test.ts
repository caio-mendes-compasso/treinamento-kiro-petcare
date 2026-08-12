import { describe, it, expect, beforeEach } from "vitest";
import * as fc from "fast-check";
import { loadAppointments, saveAppointments } from "@/components/agenda/appointmentStorage";
import { Appointment, TimeSlot, AppointmentType, AppointmentStatus } from "@/types/agenda";

/**
 * **Validates: Requirements 5.2, 6.5**
 *
 * Property 11: Appointment localStorage round-trip
 *
 * For any list of valid appointments, serializing to localStorage via
 * `saveAppointments` and then deserializing via `loadAppointments` SHALL
 * produce an equivalent list.
 */

// --- Arbitraries ---

const arbTimeSlot: fc.Arbitrary<TimeSlot> = fc.constantFrom(
  "09:00",
  "10:00",
  "11:00",
  "14:00",
  "15:00",
  "16:00"
);

const arbAppointmentType: fc.Arbitrary<AppointmentType> = fc.constantFrom("consulta", "exame");

const arbAppointmentStatus: fc.Arbitrary<AppointmentStatus> = fc.constant("agendado");

const arbDateString = fc
  .record({
    year: fc.integer({ min: 2020, max: 2030 }),
    month: fc.integer({ min: 1, max: 12 }),
    day: fc.integer({ min: 1, max: 28 }),
  })
  .map(
    ({ year, month, day }) =>
      `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  );

const arbAppointment: fc.Arbitrary<Appointment> = fc.record({
  id: fc.uuid(),
  date: arbDateString,
  slot: arbTimeSlot,
  type: arbAppointmentType,
  petId: fc.uuid(),
  status: arbAppointmentStatus,
});

const arbAppointmentList: fc.Arbitrary<Appointment[]> = fc.array(arbAppointment, {
  minLength: 0,
  maxLength: 20,
});

// --- localStorage mock ---

let store: Record<string, string> = {};

const localStorageMock = {
  getItem: (key: string): string | null => store[key] ?? null,
  setItem: (key: string, value: string): void => {
    store[key] = value;
  },
  removeItem: (key: string): void => {
    delete store[key];
  },
  clear: (): void => {
    store = {};
  },
  get length(): number {
    return Object.keys(store).length;
  },
  key: (index: number): string | null => Object.keys(store)[index] ?? null,
};

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
  writable: true,
});

// --- Tests ---

describe("Feature: agenda-calendar-scheduling, Property 11: Appointment localStorage round-trip", () => {
  beforeEach(() => {
    store = {};
  });

  it("saveAppointments then loadAppointments produces an equivalent list", () => {
    fc.assert(
      fc.property(arbAppointmentList, (appointments) => {
        saveAppointments(appointments);
        const loaded = loadAppointments();
        expect(loaded).toEqual(appointments);
      }),
      { numRuns: 100 }
    );
  });

  it("round-trip preserves each appointment's fields exactly", () => {
    fc.assert(
      fc.property(arbAppointmentList, (appointments) => {
        saveAppointments(appointments);
        const loaded = loadAppointments();

        expect(loaded.length).toBe(appointments.length);
        for (let i = 0; i < appointments.length; i++) {
          expect(loaded[i].id).toBe(appointments[i].id);
          expect(loaded[i].date).toBe(appointments[i].date);
          expect(loaded[i].slot).toBe(appointments[i].slot);
          expect(loaded[i].type).toBe(appointments[i].type);
          expect(loaded[i].petId).toBe(appointments[i].petId);
          expect(loaded[i].status).toBe(appointments[i].status);
        }
      }),
      { numRuns: 100 }
    );
  });

  it("loadAppointments returns empty array when nothing is stored", () => {
    const loaded = loadAppointments();
    expect(loaded).toEqual([]);
  });
});
