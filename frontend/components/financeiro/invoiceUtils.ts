import { Invoice, InvoiceStatus, FilterOption } from "@/types/financeiro";

/** Month names in Portuguese */
const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

/**
 * Generates a mock barcode string for an invoice.
 */
function generateBarcode(monthIndex: number, year: number): string {
  const base = `23793.38128 60000.000${String(monthIndex).padStart(2, "0")} ${year}0.000001 1 ${String(year).slice(2)}${String(monthIndex + 1).padStart(2, "0")}00000000`;
  return base;
}

/**
 * Determines the status of an invoice based on its position in the 12-month cycle.
 * First months are "Pago", recent months "Pendente", past months without payment "Vencido".
 */
function determineStatus(monthIndex: number, currentMonthIndex: number): InvoiceStatus {
  if (monthIndex < currentMonthIndex - 1) {
    // Months well in the past: paid
    return "Pago";
  } else if (monthIndex === currentMonthIndex - 1) {
    // One month ago and unpaid: overdue
    return "Vencido";
  } else {
    // Current month or future: pending
    return "Pendente";
  }
}

/**
 * Gera 12 meses de faturas mock baseadas no preço do plano.
 * Os primeiros meses são "Pago", meses recentes "Pendente",
 * e meses passados sem pagamento "Vencido".
 */
export function generateInvoices(planPrice: number): Invoice[] {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Start from January of the current year
  const startMonth = 0;
  const startYear = currentYear;

  const invoices: Invoice[] = [];

  for (let i = 0; i < 12; i++) {
    const monthIdx = (startMonth + i) % 12;
    const year = startYear + Math.floor((startMonth + i) / 12);
    const dueDate = new Date(year, monthIdx, 10);
    const status = determineStatus(i, currentMonth);

    invoices.push({
      id: `inv-${year}-${String(monthIdx + 1).padStart(2, "0")}`,
      month: `${MONTH_NAMES[monthIdx]} ${year}`,
      monthIndex: i,
      year,
      amount: planPrice,
      status,
      dueDate: dueDate.toISOString().split("T")[0],
      barcode: generateBarcode(monthIdx, year),
    });
  }

  return invoices;
}

/**
 * Filtra faturas por status.
 * "todos" retorna todas as faturas sem alteração.
 */
export function filterInvoices(invoices: Invoice[], filter: FilterOption): Invoice[] {
  if (filter === "todos") {
    return invoices;
  }

  const statusMap: Record<Exclude<FilterOption, "todos">, InvoiceStatus> = {
    pago: "Pago",
    pendente: "Pendente",
    vencido: "Vencido",
  };

  const targetStatus = statusMap[filter];
  return invoices.filter((invoice) => invoice.status === targetStatus);
}

/**
 * Calcula os totais por status.
 */
export function calculateSummary(invoices: Invoice[]): {
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
} {
  return invoices.reduce(
    (acc, invoice) => {
      switch (invoice.status) {
        case "Pago":
          acc.totalPaid += invoice.amount;
          break;
        case "Pendente":
          acc.totalPending += invoice.amount;
          break;
        case "Vencido":
          acc.totalOverdue += invoice.amount;
          break;
      }
      return acc;
    },
    { totalPaid: 0, totalPending: 0, totalOverdue: 0 }
  );
}

/**
 * Formata um número como moeda brasileira (R$ X.XXX,XX).
 */
export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/**
 * Gera número do plano no formato PC-2025-XXXXXX.
 * Usa um hash determinístico do petId para gerar os 6 dígitos.
 */
export function generatePlanNumber(petId: string): string {
  let hash = 0;
  for (let i = 0; i < petId.length; i++) {
    hash = ((hash << 5) - hash) + petId.charCodeAt(i);
    hash |= 0;
  }

  const digits = String(Math.abs(hash) % 1000000).padStart(6, "0");
  return `PC-2025-${digits}`;
}
