"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { userSubscription } from "@/mocks/subscription";
import { generateInvoices, filterInvoices } from "@/components/financeiro/invoiceUtils";
import SummaryCards from "@/components/financeiro/SummaryCards";
import InvoiceFilters from "@/components/financeiro/InvoiceFilters";
import InvoiceList from "@/components/financeiro/InvoiceList";
import { FilterOption } from "@/types/financeiro";

export default function FinanceiroPage() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<FilterOption>("todos");

  const invoices = generateInvoices(userSubscription.plan.price);
  const filteredInvoices = filterInvoices(invoices, activeFilter);

  return (
    <main className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">Financeiro</h1>
        {user && (
          <p className="text-gray-500 text-sm mt-1">
            Olá, {user.nome}! Aqui está o resumo do seu plano.
          </p>
        )}
      </header>

      <SummaryCards invoices={invoices} />

      <InvoiceFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <InvoiceList invoices={filteredInvoices} />
    </main>
  );
}
