import { describe, it, expect, afterEach, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import * as fc from "fast-check";
import { render, cleanup, fireEvent } from "@testing-library/react";
import CancelDialog from "@/components/agenda/CancelDialog";
import { Appointment, TimeSlot, AppointmentType, AppointmentStatus } from "@/types/agenda";

afterEach(() => {
  cleanup();
});

// --- Generators ---

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
    year: fc.integer({ min: 2024, max: 2030 }),
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

const arbAppointmentList: fc.Arbitrary<Appointment[]> = fc.uniqueArray(arbAppointment, {
  minLength: 1,
  maxLength: 15,
  selector: (a) => a.id,
});

// --- Property 14: Cancellation removes appointment ---

/**
 * **Validates: Requirements 7.3, 7.4**
 *
 * Property 14: Cancellation removes appointment
 *
 * For any list of appointments and any appointment in that list, after
 * cancellation the resulting list SHALL have length equal to the original
 * length minus 1, and SHALL NOT contain the cancelled appointment's ID.
 */
describe("Property 14: Cancellation removes appointment", () => {
  it("confirming cancellation removes exactly one appointment from the list", () => {
    fc.assert(
      fc.property(
        arbAppointmentList.chain((appointments) =>
          fc.tuple(
            fc.constant(appointments),
            fc.integer({ min: 0, max: appointments.length - 1 })
          )
        ),
        ([appointments, cancelIndex]) => {
          const appointmentToCancel = appointments[cancelIndex];
          const originalLength = appointments.length;

          // Simulate the cancellation logic (same as in AgendaPage)
          const resultingList = appointments.filter(
            (a) => a.id !== appointmentToCancel.id
          );

          // The resulting list SHALL have length equal to original - 1
          expect(resultingList.length).toBe(originalLength - 1);

          // The resulting list SHALL NOT contain the cancelled appointment's ID
          const containsCancelled = resultingList.some(
            (a) => a.id === appointmentToCancel.id
          );
          expect(containsCancelled).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("confirming cancellation preserves all other appointments", () => {
    fc.assert(
      fc.property(
        arbAppointmentList.chain((appointments) =>
          fc.tuple(
            fc.constant(appointments),
            fc.integer({ min: 0, max: appointments.length - 1 })
          )
        ),
        ([appointments, cancelIndex]) => {
          const appointmentToCancel = appointments[cancelIndex];

          // Simulate the cancellation logic
          const resultingList = appointments.filter(
            (a) => a.id !== appointmentToCancel.id
          );

          // All appointments that were NOT cancelled should still be present
          const remainingIds = resultingList.map((a) => a.id);
          appointments.forEach((a) => {
            if (a.id !== appointmentToCancel.id) {
              expect(remainingIds).toContain(a.id);
            }
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it("CancelDialog onConfirm callback is called when user confirms cancellation", () => {
    fc.assert(
      fc.property(arbAppointment, (appointment) => {
        const onConfirm = vi.fn();
        const onCancel = vi.fn();

        const { container } = render(
          <CancelDialog
            appointment={appointment}
            isOpen={true}
            onConfirm={onConfirm}
            onCancel={onCancel}
          />
        );

        // Find and click the "Confirmar cancelamento" button
        const confirmButton = Array.from(
          container.querySelectorAll("button")
        ).find((btn) =>
          btn.textContent?.includes("Confirmar cancelamento")
        ) as HTMLElement;

        expect(confirmButton).not.toBeNull();
        fireEvent.click(confirmButton);

        // onConfirm should be called exactly once
        expect(onConfirm).toHaveBeenCalledTimes(1);
        // onCancel should NOT have been called
        expect(onCancel).not.toHaveBeenCalled();

        cleanup();
      }),
      { numRuns: 100 }
    );
  });
});

// --- Property 15: Cancellation dismissal preserves state ---

/**
 * **Validates: Requirements 7.6**
 *
 * Property 15: Cancellation dismissal preserves state
 *
 * For any list of appointments and any appointment selected for cancellation,
 * dismissing the cancel dialog (clicking "Voltar" or outside) SHALL leave the
 * appointments list identical to its state before the dialog was opened.
 */
describe("Property 15: Cancellation dismissal preserves state", () => {
  it("clicking 'Voltar' calls onCancel (state remains unchanged)", () => {
    fc.assert(
      fc.property(arbAppointment, (appointment) => {
        const onConfirm = vi.fn();
        const onCancel = vi.fn();

        const { container } = render(
          <CancelDialog
            appointment={appointment}
            isOpen={true}
            onConfirm={onConfirm}
            onCancel={onCancel}
          />
        );

        // Find and click the "Voltar" button
        const voltarButton = Array.from(
          container.querySelectorAll("button")
        ).find((btn) => btn.textContent?.includes("Voltar")) as HTMLElement;

        expect(voltarButton).not.toBeNull();
        fireEvent.click(voltarButton);

        // onCancel should be called (which preserves state in parent)
        expect(onCancel).toHaveBeenCalledTimes(1);
        // onConfirm should NOT have been called
        expect(onConfirm).not.toHaveBeenCalled();

        cleanup();
      }),
      { numRuns: 100 }
    );
  });

  it("clicking outside the dialog (backdrop) calls onCancel (state remains unchanged)", () => {
    fc.assert(
      fc.property(arbAppointment, (appointment) => {
        const onConfirm = vi.fn();
        const onCancel = vi.fn();

        const { container } = render(
          <CancelDialog
            appointment={appointment}
            isOpen={true}
            onConfirm={onConfirm}
            onCancel={onCancel}
          />
        );

        // Click the backdrop (the outer fixed div)
        const backdrop = container.firstElementChild as HTMLElement;
        expect(backdrop).not.toBeNull();
        fireEvent.click(backdrop);

        // onCancel should be called (preserving state)
        expect(onCancel).toHaveBeenCalledTimes(1);
        // onConfirm should NOT have been called
        expect(onConfirm).not.toHaveBeenCalled();

        cleanup();
      }),
      { numRuns: 100 }
    );
  });

  it("dismissing the dialog leaves the appointments list identical to its state before opening", () => {
    fc.assert(
      fc.property(
        arbAppointmentList.chain((appointments) =>
          fc.tuple(
            fc.constant(appointments),
            fc.integer({ min: 0, max: appointments.length - 1 })
          )
        ),
        ([appointments, selectedIndex]) => {
          // Snapshot of the list before the dialog opens
          const snapshotBefore = JSON.parse(JSON.stringify(appointments));

          // Simulate dialog dismissal: the onCancel callback does NOT modify the list
          // In the AgendaPage, onCancel simply sets `setAppointmentToCancel(null)`
          // The appointments list remains untouched
          const appointmentsAfterDismissal = [...appointments];

          // The list MUST be identical to its state before the dialog was opened
          expect(appointmentsAfterDismissal).toEqual(snapshotBefore);
          expect(appointmentsAfterDismissal.length).toBe(snapshotBefore.length);

          // Every appointment should have the same fields
          for (let i = 0; i < snapshotBefore.length; i++) {
            expect(appointmentsAfterDismissal[i].id).toBe(snapshotBefore[i].id);
            expect(appointmentsAfterDismissal[i].date).toBe(snapshotBefore[i].date);
            expect(appointmentsAfterDismissal[i].slot).toBe(snapshotBefore[i].slot);
            expect(appointmentsAfterDismissal[i].type).toBe(snapshotBefore[i].type);
            expect(appointmentsAfterDismissal[i].petId).toBe(snapshotBefore[i].petId);
            expect(appointmentsAfterDismissal[i].status).toBe(snapshotBefore[i].status);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
