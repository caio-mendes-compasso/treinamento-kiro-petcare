"use client";

import { Invoice } from "@/types/financeiro";
import InvoiceCard from "./InvoiceCard";

interface InvoiceListProps {
  invoices: Invoice[];
}

export default function InvoiceList({ invoices }: InvoiceListProps) {
  const handleCopyBarcode = async (invoice: Invoice) => {
    try {
      await navigator.clipboard.writeText(invoice.barcode);
      window.alert("Código de barras copiado com sucesso!");
    } catch {
      window.alert(invoice.barcode);
    }
  };

  const handleSecondCopy = (_invoice: Invoice) => {
    window.alert("Download da 2ª via iniciado com sucesso!");
  };

  if (invoices.length === 0) {
    return (
      <section aria-label="Lista de faturas">
        <p className="text-center text-gray-500 py-8">
          Nenhuma fatura encontrada
        </p>
      </section>
    );
  }

  return (
    <section aria-label="Lista de faturas">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {invoices.map((invoice) => (
          <InvoiceCard
            key={invoice.id}
            invoice={invoice}
            onCopyBarcode={handleCopyBarcode}
            onSecondCopy={handleSecondCopy}
          />
        ))}
      </div>
    </section>
  );
}
