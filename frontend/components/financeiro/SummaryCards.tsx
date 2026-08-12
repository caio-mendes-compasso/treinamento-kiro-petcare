"use client";

import { Invoice } from "@/types/financeiro";
import { calculateSummary, formatCurrency } from "./invoiceUtils";

interface SummaryCardsProps {
  invoices: Invoice[];
}

export default function SummaryCards({ invoices }: SummaryCardsProps) {
  const { totalPaid, totalPending, totalOverdue } = calculateSummary(invoices);

  return (
    <section
      aria-label="Resumo financeiro"
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      {/* Total Pago */}
      <div
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6"
        role="group"
        aria-label="Total Pago"
      >
        <div className="flex items-center gap-3">
          <span className="text-emerald-500" aria-hidden="true">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
          <div>
            <p className="text-gray-500 text-sm">Total Pago</p>
            <p className="text-gray-900 font-semibold text-lg">
              {formatCurrency(totalPaid)}
            </p>
          </div>
        </div>
      </div>

      {/* Pendente */}
      <div
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6"
        role="group"
        aria-label="Pendente"
      >
        <div className="flex items-center gap-3">
          <span className="text-amber-500" aria-hidden="true">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
          <div>
            <p className="text-gray-500 text-sm">Pendente</p>
            <p className="text-gray-900 font-semibold text-lg">
              {formatCurrency(totalPending)}
            </p>
          </div>
        </div>
      </div>

      {/* Vencido */}
      <div
        className={`rounded-lg shadow-sm border p-4 md:p-6 ${
          totalOverdue > 0
            ? "bg-red-50 border-red-300"
            : "bg-white border-gray-200"
        }`}
        role="group"
        aria-label="Vencido"
        data-testid="overdue-card"
      >
        <div className="flex items-center gap-3">
          <span
            className={totalOverdue > 0 ? "text-red-500" : "text-gray-400"}
            aria-hidden="true"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </span>
          <div>
            <p className="text-gray-500 text-sm">Vencido</p>
            <p
              className={`font-semibold text-lg ${
                totalOverdue > 0 ? "text-red-500" : "text-gray-900"
              }`}
              style={totalOverdue > 0 ? { color: "#EF4444" } : undefined}
            >
              {formatCurrency(totalOverdue)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
