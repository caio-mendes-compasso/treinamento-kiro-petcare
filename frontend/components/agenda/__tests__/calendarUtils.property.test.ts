import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import {
  generateCalendarGrid,
  getDaysInMonth,
  getNextMonth,
  getPreviousMonth,
  getBlockedSlots,
} from "@/components/agenda/calendarUtils";
import { ALL_SLOTS } from "@/types/agenda";

/**
 * **Validates: Requirements 1.2**
 *
 * Property 1: Calendar grid produces correct number of days
 *
 * For any valid year and month (0–11), the generateCalendarGrid function
 * SHALL produce exactly as many isCurrentMonth: true entries as the actual
 * number of days in that month (28–31).
 */
describe("Property 1: Calendar grid produces correct number of days", () => {
  it("generates exactly as many isCurrentMonth: true entries as the actual days in the month", () => {
    const validYear = fc.integer({ min: 1970, max: 2100 });
    const validMonth = fc.integer({ min: 0, max: 11 });

    fc.assert(
      fc.property(validYear, validMonth, (year, month) => {
        const grid = generateCalendarGrid(year, month);
        const currentMonthDays = grid.filter((d) => d.isCurrentMonth);
        const expectedDays = getDaysInMonth(year, month);

        expect(currentMonthDays.length).toBe(expectedDays);
      }),
      { numRuns: 100 }
    );
  });

  it("each isCurrentMonth day has a valid date number from 1 to daysInMonth", () => {
    const validYear = fc.integer({ min: 1970, max: 2100 });
    const validMonth = fc.integer({ min: 0, max: 11 });

    fc.assert(
      fc.property(validYear, validMonth, (year, month) => {
        const grid = generateCalendarGrid(year, month);
        const currentMonthDays = grid.filter((d) => d.isCurrentMonth);
        const daysInMonth = getDaysInMonth(year, month);

        currentMonthDays.forEach((day) => {
          expect(day.date).toBeGreaterThanOrEqual(1);
          expect(day.date).toBeLessThanOrEqual(daysInMonth);
        });
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * **Validates: Requirements 1.3, 1.4**
 *
 * Property 2: Calendar navigation round-trip
 *
 * For any valid year and month, navigating to the next month and then back
 * to the previous month SHALL return to the original year and month values.
 * Symmetrically, navigating previous then next SHALL also return to the original.
 */
describe("Property 2: Calendar navigation round-trip", () => {
  it("next then previous returns to original year and month", () => {
    const validYear = fc.integer({ min: 1970, max: 2100 });
    const validMonth = fc.integer({ min: 0, max: 11 });

    fc.assert(
      fc.property(validYear, validMonth, (year, month) => {
        const next = getNextMonth(year, month);
        const backToOriginal = getPreviousMonth(next.year, next.month);

        expect(backToOriginal.year).toBe(year);
        expect(backToOriginal.month).toBe(month);
      }),
      { numRuns: 100 }
    );
  });

  it("previous then next returns to original year and month", () => {
    const validYear = fc.integer({ min: 1970, max: 2100 });
    const validMonth = fc.integer({ min: 0, max: 11 });

    fc.assert(
      fc.property(validYear, validMonth, (year, month) => {
        const prev = getPreviousMonth(year, month);
        const backToOriginal = getNextMonth(prev.year, prev.month);

        expect(backToOriginal.year).toBe(year);
        expect(backToOriginal.month).toBe(month);
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * **Validates: Requirements 2.2**
 *
 * Property 3: Past days are disabled
 *
 * For any date string that is strictly before today's date, the generated
 * CalendarDay SHALL have isPast: true.
 */
describe("Property 3: Past days are disabled", () => {
  it("any day strictly before today has isPast: true in the calendar grid", () => {
    // Generate dates guaranteed to be in the past
    const pastYear = fc.integer({ min: 2000, max: new Date().getFullYear() - 1 });
    const pastMonth = fc.integer({ min: 0, max: 11 });

    fc.assert(
      fc.property(pastYear, pastMonth, (year, month) => {
        const grid = generateCalendarGrid(year, month);
        const currentMonthDays = grid.filter((d) => d.isCurrentMonth);

        // All days from a year strictly before current year are in the past
        currentMonthDays.forEach((day) => {
          expect(day.isPast).toBe(true);
        });
      }),
      { numRuns: 100 }
    );
  });

  it("days before today in the current month have isPast: true", () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();

    // Only run if there are past days in the current month
    if (currentDay > 1) {
      const grid = generateCalendarGrid(currentYear, currentMonth);
      const pastDays = grid.filter(
        (d) => d.isCurrentMonth && d.date < currentDay
      );

      pastDays.forEach((day) => {
        expect(day.isPast).toBe(true);
      });
    }
  });
});

/**
 * **Validates: Requirements 3.1, 3.2**
 *
 * Property 5: Blocked slots invariant
 *
 * For any valid date string, the getBlockedSlots function SHALL return exactly
 * 2 distinct slots from the set of 6 available slots.
 */
describe("Property 5: Blocked slots invariant", () => {
  it("returns exactly 2 blocked slots for any valid date string", () => {
    const validYear = fc.integer({ min: 2000, max: 2100 });
    const validMonth = fc.integer({ min: 1, max: 12 });
    const validDay = fc.integer({ min: 1, max: 28 }); // 28 is safe for all months

    const dateStringArb = fc.tuple(validYear, validMonth, validDay).map(
      ([y, m, d]) =>
        `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`
    );

    fc.assert(
      fc.property(dateStringArb, (dateString) => {
        const blocked = getBlockedSlots(dateString);
        expect(blocked.length).toBe(2);
      }),
      { numRuns: 100 }
    );
  });

  it("blocked slots are distinct (no duplicates)", () => {
    const validYear = fc.integer({ min: 2000, max: 2100 });
    const validMonth = fc.integer({ min: 1, max: 12 });
    const validDay = fc.integer({ min: 1, max: 28 });

    const dateStringArb = fc.tuple(validYear, validMonth, validDay).map(
      ([y, m, d]) =>
        `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`
    );

    fc.assert(
      fc.property(dateStringArb, (dateString) => {
        const blocked = getBlockedSlots(dateString);
        expect(blocked[0]).not.toBe(blocked[1]);
      }),
      { numRuns: 100 }
    );
  });

  it("blocked slots are from the set of 6 available slots", () => {
    const validYear = fc.integer({ min: 2000, max: 2100 });
    const validMonth = fc.integer({ min: 1, max: 12 });
    const validDay = fc.integer({ min: 1, max: 28 });

    const dateStringArb = fc.tuple(validYear, validMonth, validDay).map(
      ([y, m, d]) =>
        `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`
    );

    fc.assert(
      fc.property(dateStringArb, (dateString) => {
        const blocked = getBlockedSlots(dateString);
        blocked.forEach((slot) => {
          expect(ALL_SLOTS).toContain(slot);
        });
      }),
      { numRuns: 100 }
    );
  });

  it("blocked slots are deterministic (same date always produces same result)", () => {
    const validYear = fc.integer({ min: 2000, max: 2100 });
    const validMonth = fc.integer({ min: 1, max: 12 });
    const validDay = fc.integer({ min: 1, max: 28 });

    const dateStringArb = fc.tuple(validYear, validMonth, validDay).map(
      ([y, m, d]) =>
        `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`
    );

    fc.assert(
      fc.property(dateStringArb, (dateString) => {
        const first = getBlockedSlots(dateString);
        const second = getBlockedSlots(dateString);
        expect(first).toEqual(second);
      }),
      { numRuns: 100 }
    );
  });
});
