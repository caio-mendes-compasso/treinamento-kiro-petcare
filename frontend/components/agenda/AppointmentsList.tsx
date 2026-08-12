"use client";

import { Appointment } from "@/types/agenda";
import { Pet } from "@/types/pets";
import AppointmentCard from "./AppointmentCard";

interface AppointmentsListProps {
  appointments: Appointment[];
  pets: Pet[];
  onCancel: (appointmentId: string) => void;
}

export default function AppointmentsList({
  appointments,
  pets,
  onCancel,
}: AppointmentsListProps) {
  const futureAppointments = appointments
    .filter((a) => new Date(`${a.date}T${a.slot}`) >= new Date())
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.slot}`);
      const dateB = new Date(`${b.date}T${b.slot}`);
      return dateA.getTime() - dateB.getTime();
    });

  const getPetName = (petId: string): string => {
    const pet = pets.find((p) => p.id === petId);
    return pet ? pet.name : "Pet não encontrado";
  };

  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Próximos agendamentos
      </h2>

      {futureAppointments.length === 0 ? (
        <p className="text-gray-500 text-sm">Nenhum agendamento futuro.</p>
      ) : (
        <div className="space-y-4">
          {futureAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              petName={getPetName(appointment.petId)}
              onCancel={() => onCancel(appointment.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
