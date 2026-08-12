import { describe, it, expect, afterEach, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import * as fc from "fast-check";
import { render, cleanup, fireEvent, screen } from "@testing-library/react";
import SchedulingModal from "@/components/agenda/SchedulingModal";
import { Appointment, TimeSlot, AppointmentType, ALL_SLOTS } from "@/types/agenda";
import { getBlockedSlots } from "@/components/agenda/calendarUtils";
import { Pet, Species } from "@/types/pets";

afterEach(() => {
  cleanup();
});

// --- Generators ---

const speciesArb: fc.Arbitrary<Species> = fc.constantFrom("cao", "gato", "outro");

const petArb: fc.Arbitrary<Pet> = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 20 }).filter((s) => s.trim().length >= 1),
  species: speciesArb,
  breed: fc.string({ minLength: 1, maxLength: 20 }).filter((s) => s.trim().length >= 1),
  birthDate: fc.constant("2020-01-01"),
  weight: fc.float({ min: Math.fround(0.5), max: Math.fround(50), noNaN: true }).filter((n) => n > 0),
  color: fc.string({ minLength: 1, maxLength: 15 }).filter((s) => s.trim().length >= 1),
  photo: fc.constant(null),
});

// Generate unique pets (distinct IDs) to avoid React key warnings
const uniquePetsArb = (min: number, max: number): fc.Arbitrary<Pet[]> =>
  fc.uniqueArray(petArb, { minLength: min, maxLength: max, selector: (p) => p.id });

const timeSlotArb: fc.Arbitrary<TimeSlot> = fc.constantFrom(
  "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"
);

const appointmentTypeArb: fc.Arbitrary<AppointmentType> = fc.constantFrom("consulta", "exame");

// Use a fixed future date to avoid past-day issues
const FUTURE_YEAR = new Date().getFullYear() + 1;

const futureDateArb: fc.Arbitrary<Date> = fc
  .tuple(fc.integer({ min: 1, max: 12 }), fc.integer({ min: 1, max: 28 }))
  .map(([month, day]) => new Date(FUTURE_YEAR, month - 1, day));

function dateToString(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Generate appointments for a specific date
const appointmentForDateArb = (dateString: string, slot: TimeSlot): fc.Arbitrary<Appointment> =>
  fc.record({
    id: fc.uuid(),
    date: fc.constant(dateString),
    slot: fc.constant(slot),
    type: appointmentTypeArb,
    petId: fc.uuid(),
    status: fc.constant("agendado" as const),
  });

// --- Property 6: Unavailable slots are not selectable ---

/**
 * **Validates: Requirements 3.3, 3.4**
 *
 * Property 6: Unavailable slots are not selectable
 *
 * For any slot that is either blocked (via getBlockedSlots) or already has an
 * existing appointment for that date, attempting to select it SHALL not change
 * the selected slot state.
 */
describe("Property 6: Unavailable slots are not selectable", () => {
  it("clicking a blocked slot does not select it", () => {
    fc.assert(
      fc.property(
        futureDateArb,
        uniquePetsArb(1, 3),
        (date, pets) => {
          const dateString = dateToString(date);
          const blockedSlots = getBlockedSlots(dateString);
          const onConfirm = vi.fn();
          const onClose = vi.fn();

          const { container } = render(
            <SchedulingModal
              isOpen={true}
              selectedDate={date}
              pets={pets}
              existingAppointments={[]}
              onConfirm={onConfirm}
              onClose={onClose}
            />
          );

          // Click each blocked slot
          blockedSlots.forEach((slot) => {
            const buttons = container.querySelectorAll("button[type='button']");
            const slotButton = Array.from(buttons).find(
              (btn) => btn.textContent?.includes(slot)
            ) as HTMLElement;

            if (slotButton) {
              fireEvent.click(slotButton);
            }
          });

          // Confirm button should still be disabled since no slot was selected
          const confirmButton = container.querySelector(
            "button:not([type='button'])"
          ) || Array.from(container.querySelectorAll("button")).find(
            (btn) => btn.textContent?.includes("Confirmar agendamento")
          ) as HTMLElement;

          // Blocked slots have "disabled" attribute
          blockedSlots.forEach((slot) => {
            const buttons = container.querySelectorAll("button[type='button']");
            const slotButton = Array.from(buttons).find(
              (btn) => btn.textContent?.includes(slot)
            ) as HTMLElement;
            if (slotButton) {
              expect(slotButton).toBeDisabled();
            }
          });

          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  it("clicking an occupied slot does not select it", () => {
    fc.assert(
      fc.property(
        futureDateArb,
        uniquePetsArb(1, 3),
        timeSlotArb,
        (date, pets, occupiedSlot) => {
          const dateString = dateToString(date);
          const blockedSlots = getBlockedSlots(dateString);

          // Skip if the chosen slot is already blocked (tested above)
          if (blockedSlots.includes(occupiedSlot)) return;

          // Create an existing appointment occupying this slot
          const existingAppointment: Appointment = {
            id: "existing-1",
            date: dateString,
            slot: occupiedSlot,
            type: "consulta",
            petId: pets[0].id,
            status: "agendado",
          };

          const onConfirm = vi.fn();
          const onClose = vi.fn();

          const { container } = render(
            <SchedulingModal
              isOpen={true}
              selectedDate={date}
              pets={pets}
              existingAppointments={[existingAppointment]}
              onConfirm={onConfirm}
              onClose={onClose}
            />
          );

          // Find the occupied slot button and click it
          const buttons = container.querySelectorAll("button[type='button']");
          const slotButton = Array.from(buttons).find(
            (btn) => btn.textContent?.includes(occupiedSlot)
          ) as HTMLElement;

          if (slotButton) {
            fireEvent.click(slotButton);
            // The button should be disabled
            expect(slotButton).toBeDisabled();
          }

          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });
});

// --- Property 7: Available slot selection ---

/**
 * **Validates: Requirements 3.5**
 *
 * Property 7: Available slot selection
 *
 * For any slot that is neither blocked nor occupied by an existing appointment,
 * selecting it SHALL update the selected slot state to that slot's time value.
 */
describe("Property 7: Available slot selection", () => {
  it("clicking an available slot selects it (visual feedback)", () => {
    fc.assert(
      fc.property(
        futureDateArb,
        uniquePetsArb(1, 3),
        (date, pets) => {
          const dateString = dateToString(date);
          const blockedSlots = getBlockedSlots(dateString);

          // Find an available slot (not blocked, no existing appointments)
          const availableSlots = ALL_SLOTS.filter(
            (s) => !blockedSlots.includes(s)
          );

          if (availableSlots.length === 0) return;

          const onConfirm = vi.fn();
          const onClose = vi.fn();

          const { container } = render(
            <SchedulingModal
              isOpen={true}
              selectedDate={date}
              pets={pets}
              existingAppointments={[]}
              onConfirm={onConfirm}
              onClose={onClose}
            />
          );

          // Click the first available slot
          const targetSlot = availableSlots[0];
          const buttons = container.querySelectorAll("button[type='button']");
          const slotButton = Array.from(buttons).find(
            (btn) => btn.textContent?.includes(targetSlot)
          ) as HTMLElement;

          if (slotButton) {
            fireEvent.click(slotButton);

            // After clicking, the slot button should have the selected styling
            // Selected state uses bg-primary-500 class
            expect(slotButton.className).toContain("bg-primary-500");
          }

          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  it("clicking another available slot changes the selection", () => {
    fc.assert(
      fc.property(
        futureDateArb,
        uniquePetsArb(1, 3),
        (date, pets) => {
          const dateString = dateToString(date);
          const blockedSlots = getBlockedSlots(dateString);

          const availableSlots = ALL_SLOTS.filter(
            (s) => !blockedSlots.includes(s)
          );

          // Need at least 2 available slots to test switching
          if (availableSlots.length < 2) return;

          const onConfirm = vi.fn();
          const onClose = vi.fn();

          const { container } = render(
            <SchedulingModal
              isOpen={true}
              selectedDate={date}
              pets={pets}
              existingAppointments={[]}
              onConfirm={onConfirm}
              onClose={onClose}
            />
          );

          const buttons = container.querySelectorAll("button[type='button']");

          // Click first available slot
          const firstButton = Array.from(buttons).find(
            (btn) => btn.textContent?.includes(availableSlots[0])
          ) as HTMLElement;
          if (firstButton) fireEvent.click(firstButton);

          // Click second available slot
          const secondButton = Array.from(buttons).find(
            (btn) => btn.textContent?.includes(availableSlots[1])
          ) as HTMLElement;
          if (secondButton) {
            fireEvent.click(secondButton);
            // Second should now be selected
            expect(secondButton.className).toContain("bg-primary-500");
            // First should no longer be selected
            expect(firstButton.className).not.toContain("bg-primary-500");
          }

          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });
});

// --- Property 8: Confirm button disabled when form incomplete ---

/**
 * **Validates: Requirements 4.5**
 *
 * Property 8: Confirm button disabled when form incomplete
 *
 * For any combination of form state where the selected slot is null OR the
 * appointment type is null OR the selected pet is null, the confirm button
 * SHALL be disabled.
 */
describe("Property 8: Confirm button disabled when form incomplete", () => {
  it("confirm button is disabled when no slot is selected", () => {
    fc.assert(
      fc.property(
        futureDateArb,
        uniquePetsArb(1, 3),
        (date, pets) => {
          const onConfirm = vi.fn();
          const onClose = vi.fn();

          const { container } = render(
            <SchedulingModal
              isOpen={true}
              selectedDate={date}
              pets={pets}
              existingAppointments={[]}
              onConfirm={onConfirm}
              onClose={onClose}
            />
          );

          // Find the confirm button
          const confirmButton = Array.from(
            container.querySelectorAll("button")
          ).find((btn) =>
            btn.textContent?.includes("Confirmar agendamento")
          ) as HTMLElement;

          // Without selecting a slot, button must be disabled
          expect(confirmButton).toBeDisabled();

          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  it("confirm button is disabled when no appointment type is selected", () => {
    fc.assert(
      fc.property(
        futureDateArb,
        uniquePetsArb(1, 3),
        (date, pets) => {
          const dateString = dateToString(date);
          const blockedSlots = getBlockedSlots(dateString);
          const availableSlots = ALL_SLOTS.filter((s) => !blockedSlots.includes(s));

          if (availableSlots.length === 0) return;

          const onConfirm = vi.fn();
          const onClose = vi.fn();

          const { container } = render(
            <SchedulingModal
              isOpen={true}
              selectedDate={date}
              pets={pets}
              existingAppointments={[]}
              onConfirm={onConfirm}
              onClose={onClose}
            />
          );

          // Select an available slot
          const buttons = container.querySelectorAll("button[type='button']");
          const slotButton = Array.from(buttons).find(
            (btn) => btn.textContent?.includes(availableSlots[0])
          ) as HTMLElement;
          if (slotButton) fireEvent.click(slotButton);

          // Don't select appointment type - button should still be disabled
          const confirmButton = Array.from(
            container.querySelectorAll("button")
          ).find((btn) =>
            btn.textContent?.includes("Confirmar agendamento")
          ) as HTMLElement;

          expect(confirmButton).toBeDisabled();

          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  it("confirm button is disabled when no pet is selected (multiple pets)", () => {
    fc.assert(
      fc.property(
        futureDateArb,
        uniquePetsArb(2, 4),
        (date, pets) => {
          const dateString = dateToString(date);
          const blockedSlots = getBlockedSlots(dateString);
          const availableSlots = ALL_SLOTS.filter((s) => !blockedSlots.includes(s));

          if (availableSlots.length === 0) return;

          const onConfirm = vi.fn();
          const onClose = vi.fn();

          const { container } = render(
            <SchedulingModal
              isOpen={true}
              selectedDate={date}
              pets={pets}
              existingAppointments={[]}
              onConfirm={onConfirm}
              onClose={onClose}
            />
          );

          // Select a slot
          const buttons = container.querySelectorAll("button[type='button']");
          const slotButton = Array.from(buttons).find(
            (btn) => btn.textContent?.includes(availableSlots[0])
          ) as HTMLElement;
          if (slotButton) fireEvent.click(slotButton);

          // Select appointment type
          const consultaRadio = container.querySelector(
            'input[value="consulta"]'
          ) as HTMLInputElement;
          if (consultaRadio) fireEvent.click(consultaRadio);

          // Don't select a pet - button should still be disabled
          const confirmButton = Array.from(
            container.querySelectorAll("button")
          ).find((btn) =>
            btn.textContent?.includes("Confirmar agendamento")
          ) as HTMLElement;

          expect(confirmButton).toBeDisabled();

          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });
});

// --- Property 9: Pet selector visibility based on pet count ---

/**
 * **Validates: Requirements 4.2, 4.3**
 *
 * Property 9: Pet selector visibility based on pet count
 *
 * For any pets list with length greater than 1, the scheduling modal SHALL
 * render a pet selector. For a list with exactly 1 pet, the pet SHALL be
 * auto-selected without showing a selector.
 */
describe("Property 9: Pet selector visibility based on pet count", () => {
  it("renders a pet selector when more than 1 pet exists", () => {
    fc.assert(
      fc.property(
        futureDateArb,
        uniquePetsArb(2, 5),
        (date, pets) => {
          const onConfirm = vi.fn();
          const onClose = vi.fn();

          const { container } = render(
            <SchedulingModal
              isOpen={true}
              selectedDate={date}
              pets={pets}
              existingAppointments={[]}
              onConfirm={onConfirm}
              onClose={onClose}
            />
          );

          // Should find a select element (pet selector)
          const selectElement = container.querySelector("select");
          expect(selectElement).not.toBeNull();

          // The "Selecione o pet" heading should be present
          const heading = Array.from(container.querySelectorAll("h3")).find(
            (h) => h.textContent?.includes("Selecione o pet")
          );
          expect(heading).not.toBeUndefined();

          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  it("does not render a pet selector when exactly 1 pet exists (auto-selected)", () => {
    fc.assert(
      fc.property(futureDateArb, petArb, (date, pet) => {
        const onConfirm = vi.fn();
        const onClose = vi.fn();

        const { container } = render(
          <SchedulingModal
            isOpen={true}
            selectedDate={date}
            pets={[pet]}
            existingAppointments={[]}
            onConfirm={onConfirm}
            onClose={onClose}
          />
        );

        // Should NOT find a select element
        const selectElement = container.querySelector("select");
        expect(selectElement).toBeNull();

        cleanup();
      }),
      { numRuns: 100 }
    );
  });

  it("with exactly 1 pet, confirm is enabled when slot and type are selected (pet auto-selected)", () => {
    fc.assert(
      fc.property(futureDateArb, petArb, (date, pet) => {
        const dateString = dateToString(date);
        const blockedSlots = getBlockedSlots(dateString);
        const availableSlots = ALL_SLOTS.filter((s) => !blockedSlots.includes(s));

        if (availableSlots.length === 0) return;

        const onConfirm = vi.fn();
        const onClose = vi.fn();

        const { container } = render(
          <SchedulingModal
            isOpen={true}
            selectedDate={date}
            pets={[pet]}
            existingAppointments={[]}
            onConfirm={onConfirm}
            onClose={onClose}
          />
        );

        // Select a slot
        const buttons = container.querySelectorAll("button[type='button']");
        const slotButton = Array.from(buttons).find(
          (btn) => btn.textContent?.includes(availableSlots[0])
        ) as HTMLElement;
        if (slotButton) fireEvent.click(slotButton);

        // Select appointment type
        const consultaRadio = container.querySelector(
          'input[value="consulta"]'
        ) as HTMLInputElement;
        if (consultaRadio) fireEvent.click(consultaRadio);

        // Confirm button should be enabled because pet is auto-selected
        const confirmButton = Array.from(
          container.querySelectorAll("button")
        ).find((btn) =>
          btn.textContent?.includes("Confirmar agendamento")
        ) as HTMLElement;

        expect(confirmButton).not.toBeDisabled();

        cleanup();
      }),
      { numRuns: 100 }
    );
  });
});

// --- Property 17: Modal dismissal via Escape key ---

/**
 * **Validates: Requirements 9.4**
 *
 * Property 17: Modal dismissal via Escape key
 *
 * For any open modal state, dispatching a keyboard event with key "Escape"
 * SHALL result in the modal being closed (onClose is called).
 */
describe("Property 17: Modal dismissal via Escape key", () => {
  it("pressing Escape calls onClose for any open modal state", () => {
    fc.assert(
      fc.property(
        futureDateArb,
        uniquePetsArb(1, 3),
        (date, pets) => {
          const onConfirm = vi.fn();
          const onClose = vi.fn();

          render(
            <SchedulingModal
              isOpen={true}
              selectedDate={date}
              pets={pets}
              existingAppointments={[]}
              onConfirm={onConfirm}
              onClose={onClose}
            />
          );

          // Dispatch Escape key event
          fireEvent.keyDown(document, { key: "Escape" });

          expect(onClose).toHaveBeenCalledTimes(1);

          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  it("Escape does not call onClose when modal is not open", () => {
    fc.assert(
      fc.property(
        futureDateArb,
        uniquePetsArb(1, 3),
        (date, pets) => {
          const onConfirm = vi.fn();
          const onClose = vi.fn();

          render(
            <SchedulingModal
              isOpen={false}
              selectedDate={date}
              pets={pets}
              existingAppointments={[]}
              onConfirm={onConfirm}
              onClose={onClose}
            />
          );

          // Dispatch Escape key event
          fireEvent.keyDown(document, { key: "Escape" });

          expect(onClose).not.toHaveBeenCalled();

          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });
});
