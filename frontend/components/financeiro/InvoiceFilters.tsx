"use client";

import { FilterOption } from "@/types/financeiro";

interface InvoiceFiltersProps {
  activeFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
}

const filters: { label: string; value: FilterOption }[] = [
  { label: "Todos", value: "todos" },
  { label: "Pagos", value: "pago" },
  { label: "Pendentes", value: "pendente" },
  { label: "Vencidos", value: "vencido" },
];

export default function InvoiceFilters({
  activeFilter,
  onFilterChange,
}: InvoiceFiltersProps) {
  return (
    <div
      role="group"
      aria-label="Filtros de fatura"
      className="flex flex-wrap gap-2"
    >
      {filters.map(({ label, value }) => {
        const isActive = activeFilter === value;

        return (
          <button
            key={value}
            type="button"
            onClick={() => onFilterChange(value)}
            aria-pressed={isActive}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              isActive
                ? "bg-primary-500 text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-primary-50"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
