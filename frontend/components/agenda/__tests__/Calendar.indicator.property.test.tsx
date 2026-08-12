import { describe, it, expect, afterEach } from "vitest";
import * as fc from "fast-check";
import { render, cleanup, fireEvent } from "@testing-library/react";
import Calendar from "@/components/agenda/Calendar";
import { Appointment, TimeSlot, AppointmentType } from "@/types/agenda";
import { generateCalendarGrid } from "@/components/agenda/calendarUtils";

/**
 * **Validates: Requirements 2.3**
 *
 * Property 4: Appointment indicator matches data
 *
 * For any list of appointments and any day in the calendar, the day SHALL
 * show a visual indicator if and only if at least one appointment exists
 * with that day's date string.
 */

afterEach(() => {
  cleanup();
});

// Use a fixed future month (next year June) to avoid past-day styling issues
const FUTURE_YEAR = new Date().getFullYear() + 1;
const FUTURE_MONTH = 5; // June (0-indexed)

// Generators
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

// Generate a valid date string for a day in the future month
const futureDayArb = fc.integer({ min: 1, max: 28 }).map((day) => {
  const monthStr = String(FUTURE_MONTH + 1).padStart(2, "0");
  const dayStr = String(day).padStart(2, "0");
  return `${FUTURE_YEAR}-${monthStr}-${dayStr}`;
});

// Generate a single appointment for a specific date
const appointmentForDateArb = (dateString: string): fc.Arbitrary<Appointment> =>
  fc.record({
    id: fc.uuid(),
    date: fc.constant(dateString),
    slot: timeSlotArb,
    type: appointmentTypeArb,
    petId: fc.uuid(),
    status: fc.constant("agendado" as const),
  });

// Generate a list of appointments with dates in the future month
const appointmentsListArb: fc.Arbitrary<Appointment[]> = fc
  .array(futureDayArb, { minLength: 1, maxLength: 8 })
  .chain((dates) => fc.tuple(...dates.map((d) => appointmentForDateArb(d))))
  .map((tuple) => [...tuple]);

// Helper: navigate to the target future month by clicking "next" buttons
function navigateToMonth(container: HTMLElement): void {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Calculate how many "next" clicks are needed
  let monthsForward =
    (FUTURE_YEAR - currentYear) * 12 + (FUTURE_MONTH - currentMonth);

  const nextButton = container.querySelector(
    'button[aria-label="Próximo mês"]'
  ) as HTMLElement;

  for (let i = 0; i < monthsForward; i++) {
    fireEvent.click(nextButton);
  }
}

describe("Property 4: Appointment indicator matches data", () => {
  it("days with appointments show the indicator dot", () => {
    fc.assert(
      fc.property(appointmentsListArb, (appointments) => {
        const { container } = render(
          <Calendar appointments={appointments} onDayClick={() => {}} />
        );

        navigateToMonth(container);

        // Find all indicators in the rendered output
        const indicators = container.querySelectorAll(
          '[aria-label="Dia com agendamento"]'
        );

        // Get the unique dates that have appointments
        const appointmentDates = new Set(appointments.map((a) => a.date));

        // The number of indicators should match the number of unique dates with appointments
        expect(indicators.length).toBe(appointmentDates.size);

        cleanup();
      }),
      { numRuns: 100 }
    );
  });

  it("days without appointments do not show the indicator dot", () => {
    fc.assert(
      fc.property(appointmentsListArb, (appointments) => {
        const { container } = render(
          <Calendar appointments={appointments} onDayClick={() => {}} />
        );

        navigateToMonth(container);

        // Get all day buttons in the grid
        const dayButtons = container.querySelectorAll("button[type='button']");
        const appointmentDates = new Set(appointments.map((a) => a.date));

        // Get the grid for the target month to know date strings
        const grid = generateCalendarGrid(FUTURE_YEAR, FUTURE_MONTH);
        const currentMonthDays = grid.filter((d) => d.isCurrentMonth);

        // For each day without an appointment, verify no indicator exists
        currentMonthDays.forEach((day) => {
          if (!appointmentDates.has(day.dateString)) {
            // Find the button for this day - the button's text should contain the day number
            const dayButton = Array.from(dayButtons).find(
              (btn) => btn.textContent?.trim() === String(day.date)
            );
            if (dayButton) {
              const indicator = dayButton.querySelector(
                '[aria-label="Dia com agendamento"]'
              );
              expect(indicator).toBeNull();
            }
          }
        });

        cleanup();
      }),
      { numRuns: 100 }
    );
  });

  it("indicator presence is if and only if appointments exist for that date", () => {
    fc.assert(
      fc.property(appointmentsListArb, (appointments) => {
        const { container } = render(
          <Calendar appointments={appointments} onDayClick={() => {}} />
        );

        navigateToMonth(container);

        const appointmentDates = new Set(appointments.map((a) => a.date));
        const grid = generateCalendarGrid(FUTURE_YEAR, FUTURE_MONTH);
        const currentMonthDays = grid.filter((d) => d.isCurrentMonth);

        // Get all day buttons (excluding navigation buttons)
        const allButtons = Array.from(
          container.querySelectorAll("button[type='button']")
        );

        currentMonthDays.forEach((day) => {
          const dayButton = allButtons.find(
            (btn) => btn.textContent?.trim() === String(day.date)
          );

          if (dayButton) {
            const indicator = dayButton.querySelector(
              '[aria-label="Dia com agendamento"]'
            );

            if (appointmentDates.has(day.dateString)) {
              // Day has appointment → indicator MUST be present
              expect(indicator).not.toBeNull();
            } else {
              // Day has no appointment → indicator MUST NOT be present
              expect(indicator).toBeNull();
            }
          }
        });

        cleanup();
      }),
      { numRuns: 100 }
    );
  });

  it("empty appointments list shows no indicators at all", () => {
    const { container } = render(
      <Calendar appointments={[]} onDayClick={() => {}} />
    );

    const indicators = container.querySelectorAll(
      '[aria-label="Dia com agendamento"]'
    );
    expect(indicators.length).toBe(0);

    cleanup();
  });
});
