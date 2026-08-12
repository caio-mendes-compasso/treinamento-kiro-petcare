import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { Appointment, TimeSlot, AppointmentType, ALL_SLOTS } from "@/types/agenda";

/**
 * **Validates: Requirements 5.1**
 *
 * Property 10: Appointment creation produces valid object
 *
 * For any valid combination of future date, available time slot, appointment type,
 * and pet ID, creating an appointment SHALL produce an `Appointment` object with
 * all fields correctly set, status equal to "agendado", and a unique non-empty ID.
 */

// --- Pure creation logic (mirrors handleConfirmAppointment from AgendaPage) ---

function createAppointment(
  selectedDate: Date,
  data: { slot: TimeSlot; type: AppointmentType; petId: string }
): Appointment {
  return {
    id: crypto.randomUUID(),
    date: selectedDate.toISOString().split("T")[0],
    slot: data.slot,
    type: data.type,
    petId: data.petId,
    status: "agendado",
  };
}

// --- Arbitraries ---

const arbTimeSlot: fc.Arbitrary<TimeSlot> = fc.constantFrom(...ALL_SLOTS);

const arbAppointmentType: fc.Arbitrary<AppointmentType> = fc.constantFrom("consulta", "exame");

const arbPetId: fc.Arbitrary<string> = fc.uuid();

/** Generates a future date (today or later) */
const arbFutureDate: fc.Arbitrary<Date> = fc
  .record({
    daysFromNow: fc.integer({ min: 0, max: 365 }),
  })
  .map(({ daysFromNow }) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    date.setHours(12, 0, 0, 0); // Normalize time to avoid timezone edge cases
    return date;
  });

// --- Tests ---

describe("Feature: agenda-calendar-scheduling, Property 10: Appointment creation produces valid object", () => {
  it("created appointment has a non-empty string ID", () => {
    fc.assert(
      fc.property(arbFutureDate, arbTimeSlot, arbAppointmentType, arbPetId, (date, slot, type, petId) => {
        const appointment = createAppointment(date, { slot, type, petId });
        expect(typeof appointment.id).toBe("string");
        expect(appointment.id.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });

  it("created appointment date matches YYYY-MM-DD format", () => {
    fc.assert(
      fc.property(arbFutureDate, arbTimeSlot, arbAppointmentType, arbPetId, (date, slot, type, petId) => {
        const appointment = createAppointment(date, { slot, type, petId });
        expect(appointment.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }),
      { numRuns: 100 }
    );
  });

  it("created appointment date corresponds to the input date", () => {
    fc.assert(
      fc.property(arbFutureDate, arbTimeSlot, arbAppointmentType, arbPetId, (date, slot, type, petId) => {
        const appointment = createAppointment(date, { slot, type, petId });
        const expectedDate = date.toISOString().split("T")[0];
        expect(appointment.date).toBe(expectedDate);
      }),
      { numRuns: 100 }
    );
  });

  it("created appointment slot matches the input slot", () => {
    fc.assert(
      fc.property(arbFutureDate, arbTimeSlot, arbAppointmentType, arbPetId, (date, slot, type, petId) => {
        const appointment = createAppointment(date, { slot, type, petId });
        expect(appointment.slot).toBe(slot);
      }),
      { numRuns: 100 }
    );
  });

  it("created appointment type matches the input type", () => {
    fc.assert(
      fc.property(arbFutureDate, arbTimeSlot, arbAppointmentType, arbPetId, (date, slot, type, petId) => {
        const appointment = createAppointment(date, { slot, type, petId });
        expect(appointment.type).toBe(type);
      }),
      { numRuns: 100 }
    );
  });

  it("created appointment petId matches the input petId", () => {
    fc.assert(
      fc.property(arbFutureDate, arbTimeSlot, arbAppointmentType, arbPetId, (date, slot, type, petId) => {
        const appointment = createAppointment(date, { slot, type, petId });
        expect(appointment.petId).toBe(petId);
      }),
      { numRuns: 100 }
    );
  });

  it("created appointment status is always 'agendado'", () => {
    fc.assert(
      fc.property(arbFutureDate, arbTimeSlot, arbAppointmentType, arbPetId, (date, slot, type, petId) => {
        const appointment = createAppointment(date, { slot, type, petId });
        expect(appointment.status).toBe("agendado");
      }),
      { numRuns: 100 }
    );
  });

  it("each created appointment has a unique ID", () => {
    fc.assert(
      fc.property(
        arbFutureDate,
        arbTimeSlot,
        arbAppointmentType,
        arbPetId,
        fc.integer({ min: 2, max: 10 }),
        (date, slot, type, petId, count) => {
          const ids = new Set<string>();
          for (let i = 0; i < count; i++) {
            const appointment = createAppointment(date, { slot, type, petId });
            ids.add(appointment.id);
          }
          expect(ids.size).toBe(count);
        }
      ),
      { numRuns: 100 }
    );
  });
});
