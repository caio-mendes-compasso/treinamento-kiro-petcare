export type InvoiceStatus = "Pago" | "Pendente" | "Vencido";

export interface Invoice {
  id: string;
  month: string;        // Nome do mês (e.g., "Janeiro 2025")
  monthIndex: number;   // 0-11 para ordenação
  year: number;
  amount: number;       // Valor numérico (derivado do plano)
  status: InvoiceStatus;
  dueDate: string;      // ISO date
  barcode: string;      // Código de barras mock
}

export type FilterOption = "todos" | "pago" | "pendente" | "vencido";

export const planColors: Record<string, string> = {
  basico: "#6B7280",    // gray-500
  plus: "#0D7377",      // primary-500
  premium: "#7C3AED",   // violet-600
};
