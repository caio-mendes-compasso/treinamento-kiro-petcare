import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import {
  calculateSummary,
  generateInvoices,
  filterInvoices,
} from "@/components/financeiro/invoiceUtils";
import { Invoice, InvoiceStatus, FilterOption } from "@/types/financeiro";

/**
 * **Validates: Requirements 1.2**
 *
 * Property 1: Summary calculation matches invoice sums by status
 *
 * For any array of invoices with arbitrary statuses and amounts, the calculated
 * summary totals SHALL equal the sum of amounts for invoices with status "Pago"
 * (totalPaid), "Pendente" (totalPending), and "Vencido" (totalOverdue) respectively.
 */
describe("Property 1: Summary calculation matches invoice sums by status", () => {
  const statusArb = fc.constantFrom<InvoiceStatus>("Pago", "Pendente", "Vencido");

  const invoiceArb: fc.Arbitrary<Invoice> = fc.record({
    id: fc.uuid(),
    month: fc.constantFrom(
      "Janeiro 2025", "Fevereiro 2025", "Março 2025", "Abril 2025",
      "Maio 2025", "Junho 2025", "Julho 2025", "Agosto 2025",
      "Setembro 2025", "Outubro 2025", "Novembro 2025", "Dezembro 2025"
    ),
    monthIndex: fc.integer({ min: 0, max: 11 }),
    year: fc.integer({ min: 2020, max: 2030 }),
    amount: fc.double({ min: 0, max: 100000, noNaN: true }),
    status: statusArb,
    dueDate: fc.constant("2025-01-10"),
    barcode: fc.string({ minLength: 10, maxLength: 50 }),
  });

  const invoicesArb = fc.array(invoiceArb, { minLength: 0, maxLength: 50 });

  it("totalPaid equals the sum of amounts for invoices with status 'Pago'", () => {
    fc.assert(
      fc.property(invoicesArb, (invoices) => {
        const summary = calculateSummary(invoices);
        const expectedPaid = invoices
          .filter((inv) => inv.status === "Pago")
          .reduce((sum, inv) => sum + inv.amount, 0);

        expect(summary.totalPaid).toBeCloseTo(expectedPaid, 5);
      }),
      { numRuns: 100 }
    );
  });

  it("totalPending equals the sum of amounts for invoices with status 'Pendente'", () => {
    fc.assert(
      fc.property(invoicesArb, (invoices) => {
        const summary = calculateSummary(invoices);
        const expectedPending = invoices
          .filter((inv) => inv.status === "Pendente")
          .reduce((sum, inv) => sum + inv.amount, 0);

        expect(summary.totalPending).toBeCloseTo(expectedPending, 5);
      }),
      { numRuns: 100 }
    );
  });

  it("totalOverdue equals the sum of amounts for invoices with status 'Vencido'", () => {
    fc.assert(
      fc.property(invoicesArb, (invoices) => {
        const summary = calculateSummary(invoices);
        const expectedOverdue = invoices
          .filter((inv) => inv.status === "Vencido")
          .reduce((sum, inv) => sum + inv.amount, 0);

        expect(summary.totalOverdue).toBeCloseTo(expectedOverdue, 5);
      }),
      { numRuns: 100 }
    );
  });

  it("sum of all summary totals equals the sum of all invoice amounts", () => {
    fc.assert(
      fc.property(invoicesArb, (invoices) => {
        const summary = calculateSummary(invoices);
        const totalAll = invoices.reduce((sum, inv) => sum + inv.amount, 0);
        const summaryTotal = summary.totalPaid + summary.totalPending + summary.totalOverdue;

        expect(summaryTotal).toBeCloseTo(totalAll, 5);
      }),
      { numRuns: 100 }
    );
  });

  it("empty invoice array produces all zeros", () => {
    const summary = calculateSummary([]);
    expect(summary.totalPaid).toBe(0);
    expect(summary.totalPending).toBe(0);
    expect(summary.totalOverdue).toBe(0);
  });
});


/**
 * **Validates: Requirements 3.5**
 *
 * Property 5: Invoice generation produces exactly 12 months with correct plan price
 *
 * For any valid plan price (positive number), generateInvoices SHALL produce
 * exactly 12 invoices, each with amount equal to the plan price, with unique
 * month references covering 12 consecutive months.
 */
describe("Property 5: Invoice generation produces exactly 12 months with correct plan price", () => {
  // Generate positive plan prices as integers (cents) mapped to reais
  const positivePlanPrice = fc.integer({ min: 1, max: 10000000 }).map((cents) => cents / 100);

  it("generates exactly 12 invoices for any positive plan price", () => {
    fc.assert(
      fc.property(positivePlanPrice, (planPrice) => {
        const invoices = generateInvoices(planPrice);
        expect(invoices.length).toBe(12);
      }),
      { numRuns: 100 }
    );
  });

  it("all invoices have amount equal to the plan price", () => {
    fc.assert(
      fc.property(positivePlanPrice, (planPrice) => {
        const invoices = generateInvoices(planPrice);
        invoices.forEach((invoice) => {
          expect(invoice.amount).toBe(planPrice);
        });
      }),
      { numRuns: 100 }
    );
  });

  it("all month references are unique", () => {
    fc.assert(
      fc.property(positivePlanPrice, (planPrice) => {
        const invoices = generateInvoices(planPrice);
        const months = invoices.map((inv) => inv.month);
        const uniqueMonths = new Set(months);
        expect(uniqueMonths.size).toBe(12);
      }),
      { numRuns: 100 }
    );
  });

  it("monthIndex values cover 0-11", () => {
    fc.assert(
      fc.property(positivePlanPrice, (planPrice) => {
        const invoices = generateInvoices(planPrice);
        const monthIndices = invoices.map((inv) => inv.monthIndex).sort((a, b) => a - b);
        expect(monthIndices).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * Shared arbitrary generators for Property 4.
 */
const filterInvoiceStatusArb: fc.Arbitrary<InvoiceStatus> = fc.constantFrom(
  "Pago",
  "Pendente",
  "Vencido"
);

const filterInvoiceArb: fc.Arbitrary<Invoice> = fc.record({
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
  year: fc.integer({ min: 2020, max: 2030 }),
  amount: fc.double({ min: 1, max: 10000, noNaN: true }),
  status: filterInvoiceStatusArb,
  dueDate: fc.constant("2025-06-10"),
  barcode: fc.string({ minLength: 10, maxLength: 60 }),
});

const invoiceArrayArb = fc.array(filterInvoiceArb, { minLength: 0, maxLength: 50 });

/**
 * **Validates: Requirements 2.2, 2.3, 2.4, 2.5**
 *
 * Property 4: Filter function returns only invoices matching the selected status
 *
 * For any array of invoices and any filter option, filterInvoices SHALL return:
 * all invoices when filter is "todos"; only invoices with status "Pago" when
 * filter is "pago"; only invoices with status "Pendente" when filter is "pendente";
 * only invoices with status "Vencido" when filter is "vencido". Additionally, the
 * union of filtered results for all three status filters SHALL equal the full invoice list.
 */
describe("Property 4: Filter function returns only invoices matching the selected status", () => {
  it('"todos" returns all invoices (same length and elements)', () => {
    fc.assert(
      fc.property(invoiceArrayArb, (invoices) => {
        const result = filterInvoices(invoices, "todos");

        expect(result.length).toBe(invoices.length);
        expect(result).toEqual(invoices);
      }),
      { numRuns: 100 }
    );
  });

  it('"pago" returns only invoices with status "Pago"', () => {
    fc.assert(
      fc.property(invoiceArrayArb, (invoices) => {
        const result = filterInvoices(invoices, "pago");

        result.forEach((invoice) => {
          expect(invoice.status).toBe("Pago");
        });

        const expected = invoices.filter((inv) => inv.status === "Pago");
        expect(result.length).toBe(expected.length);
      }),
      { numRuns: 100 }
    );
  });

  it('"pendente" returns only invoices with status "Pendente"', () => {
    fc.assert(
      fc.property(invoiceArrayArb, (invoices) => {
        const result = filterInvoices(invoices, "pendente");

        result.forEach((invoice) => {
          expect(invoice.status).toBe("Pendente");
        });

        const expected = invoices.filter((inv) => inv.status === "Pendente");
        expect(result.length).toBe(expected.length);
      }),
      { numRuns: 100 }
    );
  });

  it('"vencido" returns only invoices with status "Vencido"', () => {
    fc.assert(
      fc.property(invoiceArrayArb, (invoices) => {
        const result = filterInvoices(invoices, "vencido");

        result.forEach((invoice) => {
          expect(invoice.status).toBe("Vencido");
        });

        const expected = invoices.filter((inv) => inv.status === "Vencido");
        expect(result.length).toBe(expected.length);
      }),
      { numRuns: 100 }
    );
  });

  it("union of pago + pendente + vencido results equals the full invoice list", () => {
    fc.assert(
      fc.property(invoiceArrayArb, (invoices) => {
        const pago = filterInvoices(invoices, "pago");
        const pendente = filterInvoices(invoices, "pendente");
        const vencido = filterInvoices(invoices, "vencido");

        const union = [...pago, ...pendente, ...vencido];

        expect(union.length).toBe(invoices.length);

        // Every invoice from the original list should appear in exactly one filtered set
        invoices.forEach((invoice) => {
          const inUnion = union.filter((u) => u.id === invoice.id);
          expect(inUnion.length).toBe(1);
        });
      }),
      { numRuns: 100 }
    );
  });

  it("each specific filter returns only matching statuses for any filter option", () => {
    const statusMap: Record<Exclude<FilterOption, "todos">, InvoiceStatus> = {
      pago: "Pago",
      pendente: "Pendente",
      vencido: "Vencido",
    };

    const specificFilterArb: fc.Arbitrary<Exclude<FilterOption, "todos">> =
      fc.constantFrom("pago", "pendente", "vencido");

    fc.assert(
      fc.property(invoiceArrayArb, specificFilterArb, (invoices, filter) => {
        const result = filterInvoices(invoices, filter);
        const expectedStatus = statusMap[filter];

        // All returned invoices must have the target status
        result.forEach((invoice) => {
          expect(invoice.status).toBe(expectedStatus);
        });

        // No invoice with the target status should be missing
        const expectedCount = invoices.filter(
          (inv) => inv.status === expectedStatus
        ).length;
        expect(result.length).toBe(expectedCount);
      }),
      { numRuns: 100 }
    );
  });
});
