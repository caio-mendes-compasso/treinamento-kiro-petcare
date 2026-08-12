import { describe, it, expect, afterEach } from "vitest";
import * as fc from "fast-check";
import { render, cleanup, screen } from "@testing-library/react";
import SummaryCards from "@/components/financeiro/SummaryCards";
import { Invoice, InvoiceStatus } from "@/types/financeiro";

/**
 * **Validates: Requirements 1.4, 1.5**
 *
 * Property 3: Overdue highlight is applied if and only if overdue total is greater than zero
 *
 * For any array of invoices, the overdue summary card SHALL display red highlight
 * (#EF4444) if and only if the sum of amounts for invoices with status "Vencido"
 * is greater than zero.
 */

afterEach(() => {
  cleanup();
});

// --- Generators ---

const invoiceStatusArb: fc.Arbitrary<InvoiceStatus> = fc.constantFrom(
  "Pago",
  "Pendente",
  "Vencido"
);

const invoiceArb: fc.Arbitrary<Invoice> = fc
  .record({
    id: fc.uuid(),
    month: fc.constantFrom(
      "Janeiro 2025",
      "Fevereiro 2025",
      "Março 2025",
      "Abril 2025",
      "Maio 2025",
      "Junho 2025",
      "Julho 2025",
      "Agosto 2025",
      "Setembro 2025",
      "Outubro 2025",
      "Novembro 2025",
      "Dezembro 2025"
    ),
    monthIndex: fc.integer({ min: 0, max: 11 }),
    year: fc.constant(2025),
    amount: fc.integer({ min: 1, max: 10000 }),
    status: invoiceStatusArb,
    dueDate: fc.constant("2025-01-10"),
    barcode: fc.constant("23793.38128 60000.00001 20250.000001 1 25010000000000"),
  });

const invoicesArb: fc.Arbitrary<Invoice[]> = fc.array(invoiceArb, {
  minLength: 0,
  maxLength: 15,
});

// Helper to compute overdue total from invoices
function computeOverdueTotal(invoices: Invoice[]): number {
  return invoices
    .filter((inv) => inv.status === "Vencido")
    .reduce((sum, inv) => sum + inv.amount, 0);
}

describe("Property 3: Overdue highlight is applied if and only if overdue total is greater than zero", () => {
  it("overdue card has red highlight classes when overdue total > 0", () => {
    fc.assert(
      fc.property(invoicesArb, (invoices) => {
        const overdueTotal = computeOverdueTotal(invoices);

        render(<SummaryCards invoices={invoices} />);
        const overdueCard = screen.getByTestId("overdue-card");

        if (overdueTotal > 0) {
          expect(overdueCard.className).toContain("bg-red-50");
          expect(overdueCard.className).toContain("border-red-300");
        }

        cleanup();
      }),
      { numRuns: 100 }
    );
  });

  it("overdue card has neutral classes when overdue total === 0", () => {
    fc.assert(
      fc.property(invoicesArb, (invoices) => {
        const overdueTotal = computeOverdueTotal(invoices);

        render(<SummaryCards invoices={invoices} />);
        const overdueCard = screen.getByTestId("overdue-card");

        if (overdueTotal === 0) {
          expect(overdueCard.className).toContain("bg-white");
          expect(overdueCard.className).toContain("border-gray-200");
          expect(overdueCard.className).not.toContain("bg-red-50");
          expect(overdueCard.className).not.toContain("border-red-300");
        }

        cleanup();
      }),
      { numRuns: 100 }
    );
  });

  it("overdue highlight is biconditional: applied iff overdue total > 0", () => {
    fc.assert(
      fc.property(invoicesArb, (invoices) => {
        const overdueTotal = computeOverdueTotal(invoices);

        render(<SummaryCards invoices={invoices} />);
        const overdueCard = screen.getByTestId("overdue-card");

        const hasRedHighlight =
          overdueCard.className.includes("bg-red-50") &&
          overdueCard.className.includes("border-red-300");

        // Biconditional: red highlight iff overdue > 0
        expect(hasRedHighlight).toBe(overdueTotal > 0);

        cleanup();
      }),
      { numRuns: 100 }
    );
  });

  it("overdue amount text uses red color style iff overdue total > 0", () => {
    fc.assert(
      fc.property(invoicesArb, (invoices) => {
        const overdueTotal = computeOverdueTotal(invoices);

        render(<SummaryCards invoices={invoices} />);
        const overdueCard = screen.getByTestId("overdue-card");

        // The amount paragraph has the inline style color: #EF4444 when overdue > 0
        const amountElement = overdueCard.querySelector(
          "p.font-semibold.text-lg"
        ) as HTMLElement;

        if (overdueTotal > 0) {
          expect(amountElement.style.color).toBe("rgb(239, 68, 68)");
        } else {
          expect(amountElement.style.color).toBe("");
        }

        cleanup();
      }),
      { numRuns: 100 }
    );
  });
});
