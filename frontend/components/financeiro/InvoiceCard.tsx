"use client";

import { Invoice, InvoiceStatus } from "@/types/financeiro";
import { formatCurrency } from "./invoiceUtils";

interface InvoiceCardProps {
  invoice: Invoice;
  onCopyBarcode: (invoice: Invoice) => void;
  onSecondCopy: (invoice: Invoice) => void;
}

const statusColors: Record<InvoiceStatus, string> = {
  Pago: "bg-[#10B981] text-white",
  Pendente: "bg-[#F59E0B] text-white",
  Vencido: "bg-[#EF4444] text-white",
};

export default function InvoiceCard({
  invoice,
  onCopyBarcode,
  onSecondCopy,
}: InvoiceCardProps) {
  return (
    <article
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
      aria-label={`Fatura de ${invoice.month}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-gray-900 font-semibold text-base">
            {invoice.month}
          </h3>
          <p className="text-gray-700 text-sm">
            {formatCurrency(invoice.amount)}
          </p>
        </div>

        <span
          className={`inline-flex items-center self-start rounded-full px-3 py-1 text-xs font-medium ${statusColors[invoice.status]}`}
          aria-label={`Status: ${invoice.status}`}
        >
          {invoice.status}
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => onCopyBarcode(invoice)}
          className="rounded-lg border border-primary-500 px-4 py-2 text-sm font-medium text-primary-500 transition-colors hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Copiar código de barras
        </button>
        <button
          type="button"
          onClick={() => onSecondCopy(invoice)}
          className="rounded-lg border border-primary-500 px-4 py-2 text-sm font-medium text-primary-500 transition-colors hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          2ª via
        </button>
      </div>
    </article>
  );
}
