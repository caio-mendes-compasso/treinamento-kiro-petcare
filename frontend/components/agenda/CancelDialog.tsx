"use client";

import { Appointment } from "@/types/agenda";

interface CancelDialogProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function CancelDialog({
  appointment,
  isOpen,
  onConfirm,
  onCancel,
}: CancelDialogProps) {
  if (!isOpen || !appointment) {
    return null;
  }

  const typeLabel = appointment.type === "consulta" ? "Consulta" : "Exame";

  // Format date from YYYY-MM-DD to DD/MM/YYYY
  const [year, month, day] = appointment.date.split("-");
  const formattedDate = `${day}/${month}/${year}`;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-dialog-title"
        className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="cancel-dialog-title"
          className="text-lg font-semibold text-gray-900 mb-4"
        >
          Cancelar agendamento
        </h2>

        <div className="mb-4 text-sm text-gray-700 space-y-1">
          <p>
            <strong>Data:</strong> {formattedDate}
          </p>
          <p>
            <strong>Horário:</strong> {appointment.slot}
          </p>
          <p>
            <strong>Tipo:</strong> {typeLabel}
          </p>
        </div>

        <p className="text-gray-700 mb-6">
          Tem certeza que deseja cancelar este agendamento?
        </p>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Voltar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Confirmar cancelamento
          </button>
        </div>
      </div>
    </div>
  );
}
