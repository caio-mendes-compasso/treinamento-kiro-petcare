"use client";

import { useState, useEffect } from "react";
import { usePets } from "@/contexts/PetsContext";
import { Appointment, TimeSlot, AppointmentType } from "@/types/agenda";
import { loadAppointments, saveAppointments } from "@/components/agenda/appointmentStorage";
import Calendar from "@/components/agenda/Calendar";
import SchedulingModal from "@/components/agenda/SchedulingModal";
import AppointmentsList from "@/components/agenda/AppointmentsList";
import CancelDialog from "@/components/agenda/CancelDialog";

export default function AgendaPage() {
  const { pets } = usePets();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<Appointment | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    setAppointments(loadAppointments());
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    saveAppointments(appointments);
  }, [appointments]);

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleConfirmAppointment = (data: {
    slot: TimeSlot;
    type: AppointmentType;
    petId: string;
  }) => {
    const newAppointment: Appointment = {
      id: crypto.randomUUID(),
      date: selectedDate!.toISOString().split("T")[0],
      slot: data.slot,
      type: data.type,
      petId: data.petId,
      status: "agendado",
    };
    setAppointments((prev) => [...prev, newAppointment]);
    setIsModalOpen(false);
  };

  const handleCancelAppointment = () => {
    if (appointmentToCancel) {
      setAppointments((prev) => prev.filter((a) => a.id !== appointmentToCancel.id));
      setAppointmentToCancel(null);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Agenda</h1>
      <Calendar appointments={appointments} onDayClick={handleDayClick} />
      <SchedulingModal
        isOpen={isModalOpen}
        selectedDate={selectedDate}
        pets={pets}
        existingAppointments={appointments}
        onConfirm={handleConfirmAppointment}
        onClose={() => setIsModalOpen(false)}
      />
      <AppointmentsList
        appointments={appointments}
        pets={pets}
        onCancel={(id) => setAppointmentToCancel(appointments.find((a) => a.id === id) || null)}
      />
      <CancelDialog
        appointment={appointmentToCancel}
        isOpen={appointmentToCancel !== null}
        onConfirm={handleCancelAppointment}
        onCancel={() => setAppointmentToCancel(null)}
      />
    </div>
  );
}
