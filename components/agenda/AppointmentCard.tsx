"use client";

import { Appointment } from "@/types/agenda";

interface AppointmentCardProps {
  appointment: Appointment;
  petName: string;
  onCancel: () => void;
}

const typeLabel: Record<string, string> = {
  consulta: "Consulta",
  exame: "Exame",
};

function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split("-").map(Number);
  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ];
  return `${day} de ${months[month - 1]}, ${year}`;
}

export default function AppointmentCard({
  appointment,
  petName,
  onCancel,
}: AppointmentCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-gray-900 font-semibold">
            {formatDate(appointment.date)}
          </p>
          <p className="text-gray-700">
            {appointment.slot} — {typeLabel[appointment.type]}
          </p>
          <p className="text-gray-500 text-sm">
            {petName}
          </p>
          <p className="text-gray-500 text-sm capitalize">
            {appointment.status}
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="text-red-500 hover:text-red-600 text-sm font-medium focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded px-2 py-1 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
