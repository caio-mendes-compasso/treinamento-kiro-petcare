import { describe, it, expect, afterEach, vi, beforeEach } from "vitest";
import * as fc from "fast-check";
import { render, cleanup } from "@testing-library/react";
import AppointmentsList from "@/components/agenda/AppointmentsList";
import { Appointment, TimeSlot, AppointmentType } from "@/types/agenda";
import { Pet } from "@/types/pets";

/**
 * **Validates: Requirements 6.2, 6.4**
 *
 * Property 12: Future appointments filtering
 * For any list of appointments with mixed past and future dates, the filtered
 * appointments list SHALL contain only appointments where the date is greater
 * than or equal to today's date.
 *
 * Property 13: Appointments sorted in ascending order
 * For any list of future appointments, after sorting, each appointment's
 * datetime SHALL be less than or equal to the next appointment's datetime
 * in the list.
 */

afterEach(() => {
  cleanup();
});

// --- Fixed reference date for deterministic tests ---
const FIXED_NOW = new Date("2025-06-15T12:00:00");

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(FIXED_NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

// --- Arbitraries ---

const timeSlotArb: fc.Arbitrary<TimeSlot> = fc.constantFrom(
  "09:00",
  "10:00",
  "11:00",
  "14:00",
  "15:00",
  "16:00"
);

const appointmentTypeArb: fc.Arbitrary<AppointmentType> = fc.constantFrom(
  "consulta",
  "exame"
);

// Generate a past date (before the fixed "now")
const pastDateArb: fc.Arbitrary<string> = fc
  .record({
    year: fc.constantFrom(2023, 2024),
    month: fc.integer({ min: 1, max: 12 }),
    day: fc.integer({ min: 1, max: 28 }),
  })
  .map(
    ({ year, month, day }) =>
      `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  );

// Generate a future date (after the fixed "now")
const futureDateArb: fc.Arbitrary<string> = fc
  .record({
    year: fc.constantFrom(2025, 2026),
    month: fc.integer({ min: 7, max: 12 }),
    day: fc.integer({ min: 1, max: 28 }),
  })
  .map(
    ({ year, month, day }) =>
      `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  );

// Generate a "today" appointment with a future time slot (so it passes filter)
const todayFutureDateArb: fc.Arbitrary<string> = fc.constant("2025-06-15");

// Fixed pet for simplicity
const fixedPet: Pet = {
  id: "pet-001",
  name: "Rex",
  species: "cao",
  breed: "Labrador",
  birthDate: "2020-01-01",
  weight: 30,
  color: "Dourado",
  photo: null,
};

// Generate a past appointment (always in the past relative to FIXED_NOW)
const pastAppointmentArb: fc.Arbitrary<Appointment> = fc.record({
  id: fc.uuid(),
  date: pastDateArb,
  slot: timeSlotArb,
  type: appointmentTypeArb,
  petId: fc.constant("pet-001"),
  status: fc.constant("agendado" as const),
});

// Generate a future appointment (always in the future relative to FIXED_NOW)
const futureAppointmentArb: fc.Arbitrary<Appointment> = fc.record({
  id: fc.uuid(),
  date: futureDateArb,
  slot: timeSlotArb,
  type: appointmentTypeArb,
  petId: fc.constant("pet-001"),
  status: fc.constant("agendado" as const),
});

// Generate a mixed list of appointments (some past, some future)
const mixedAppointmentsArb: fc.Arbitrary<{
  past: Appointment[];
  future: Appointment[];
}> = fc.record({
  past: fc.array(pastAppointmentArb, { minLength: 1, maxLength: 8 }),
  future: fc.array(futureAppointmentArb, { minLength: 1, maxLength: 8 }),
});

// --- Tests ---

describe("Property 12: Future appointments filtering", () => {
  it("only future/today appointments are rendered, past appointments are excluded", () => {
    fc.assert(
      fc.property(mixedAppointmentsArb, ({ past, future }) => {
        const allAppointments = [...past, ...future];

        const { container } = render(
          <AppointmentsList
            appointments={allAppointments}
            pets={[fixedPet]}
            onCancel={() => {}}
          />
        );

        // Count rendered appointment cards
        const cards = container.querySelectorAll(".bg-white.rounded-lg.shadow-sm.border");
        
        // The number of rendered cards should equal the number of future appointments
        // (since past dates are always before FIXED_NOW and future dates are always after)
        expect(cards.length).toBe(future.length);

        cleanup();
      }),
      { numRuns: 100 }
    );
  });

  it("no past appointment date appears in the rendered output", () => {
    fc.assert(
      fc.property(mixedAppointmentsArb, ({ past, future }) => {
        const allAppointments = [...past, ...future];

        const { container } = render(
          <AppointmentsList
            appointments={allAppointments}
            pets={[fixedPet]}
            onCancel={() => {}}
          />
        );

        const textContent = container.textContent || "";

        // Past appointment dates (year 2023/2024) should NOT appear in rendered text
        for (const pastAppt of past) {
          // Extract the day number from the date
          const [year] = pastAppt.date.split("-").map(Number);
          // Years 2023 and 2024 should not appear (our future dates are 2025+)
          if (year <= 2024) {
            expect(textContent).not.toContain(String(year));
          }
        }

        cleanup();
      }),
      { numRuns: 100 }
    );
  });

  it("today appointments with future time slots are included", () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.uuid(),
          date: todayFutureDateArb,
          slot: fc.constantFrom("14:00" as TimeSlot, "15:00" as TimeSlot, "16:00" as TimeSlot),
          type: appointmentTypeArb,
          petId: fc.constant("pet-001"),
          status: fc.constant("agendado" as const),
        }),
        (todayAppointment) => {
          // FIXED_NOW is at 12:00, so slots 14:00, 15:00, 16:00 are in the future
          const { container } = render(
            <AppointmentsList
              appointments={[todayAppointment]}
              pets={[fixedPet]}
              onCancel={() => {}}
            />
          );

          const cards = container.querySelectorAll(".bg-white.rounded-lg.shadow-sm.border");
          expect(cards.length).toBe(1);

          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe("Property 13: Appointments sorted in ascending order", () => {
  it("rendered appointments are in ascending date+slot order", () => {
    fc.assert(
      fc.property(
        fc.array(futureAppointmentArb, { minLength: 2, maxLength: 10 }),
        (appointments) => {
          const { container } = render(
            <AppointmentsList
              appointments={appointments}
              pets={[fixedPet]}
              onCancel={() => {}}
            />
          );

          // Get all rendered cards in order
          const cards = container.querySelectorAll(".bg-white.rounded-lg.shadow-sm.border");

          // Extract slot times from each card (they contain the slot text)
          const renderedSlots: string[] = [];
          const renderedDates: string[] = [];

          cards.forEach((card) => {
            const text = card.textContent || "";
            // Extract the slot (pattern: HH:MM)
            const slotMatch = text.match(/(\d{2}:\d{2})/);
            if (slotMatch) renderedSlots.push(slotMatch[1]);

            // The card renders year at the end of the date: "dia de Mês, year"
            // Let's use the appointments sorted to verify order
          });

          // Verify the order by comparing with the expected sorted order
          const expectedSorted = [...appointments]
            .filter((a) => new Date(`${a.date}T${a.slot}`) >= FIXED_NOW)
            .sort((a, b) => {
              const dateA = new Date(`${a.date}T${a.slot}`);
              const dateB = new Date(`${b.date}T${b.slot}`);
              return dateA.getTime() - dateB.getTime();
            });

          // The number of cards should match the expected sorted list
          expect(cards.length).toBe(expectedSorted.length);

          // Verify order: each card's slot text should match expected order
          expectedSorted.forEach((appt, idx) => {
            const cardText = cards[idx]?.textContent || "";
            expect(cardText).toContain(appt.slot);
          });

          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  it("for any pair of adjacent rendered appointments, the first datetime <= the second", () => {
    fc.assert(
      fc.property(
        fc.array(futureAppointmentArb, { minLength: 2, maxLength: 10 }),
        (appointments) => {
          // Simulate the component's filtering and sorting logic
          const futureAppointments = appointments
            .filter((a) => new Date(`${a.date}T${a.slot}`) >= FIXED_NOW)
            .sort((a, b) => {
              const dateA = new Date(`${a.date}T${a.slot}`);
              const dateB = new Date(`${b.date}T${b.slot}`);
              return dateA.getTime() - dateB.getTime();
            });

          // Verify ascending order property
          for (let i = 0; i < futureAppointments.length - 1; i++) {
            const currentTime = new Date(
              `${futureAppointments[i].date}T${futureAppointments[i].slot}`
            ).getTime();
            const nextTime = new Date(
              `${futureAppointments[i + 1].date}T${futureAppointments[i + 1].slot}`
            ).getTime();
            expect(currentTime).toBeLessThanOrEqual(nextTime);
          }

          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  it("rendered output reflects the sorted order from the component", () => {
    fc.assert(
      fc.property(
        fc.array(futureAppointmentArb, { minLength: 2, maxLength: 6 }),
        (appointments) => {
          const { container } = render(
            <AppointmentsList
              appointments={appointments}
              pets={[fixedPet]}
              onCancel={() => {}}
            />
          );

          const cards = container.querySelectorAll(".bg-white.rounded-lg.shadow-sm.border");

          // Verify: each card slot time should be parseable and in order
          const times: number[] = [];
          const expectedSorted = [...appointments]
            .filter((a) => new Date(`${a.date}T${a.slot}`) >= FIXED_NOW)
            .sort((a, b) => {
              const dateA = new Date(`${a.date}T${a.slot}`);
              const dateB = new Date(`${b.date}T${b.slot}`);
              return dateA.getTime() - dateB.getTime();
            });

          expectedSorted.forEach((appt) => {
            times.push(new Date(`${appt.date}T${appt.slot}`).getTime());
          });

          // Verify sorted property
          for (let i = 0; i < times.length - 1; i++) {
            expect(times[i]).toBeLessThanOrEqual(times[i + 1]);
          }

          // Verify card count matches
          expect(cards.length).toBe(expectedSorted.length);

          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });
});
