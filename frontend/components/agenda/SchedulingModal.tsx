"use client";

import { useState, useEffect, useCallback } from "react";
import { Pet } from "@/types/pets";
import { AppointmentType, TimeSlot, Appointment, ALL_SLOTS } from "@/types/agenda";
import SlotButton, { SlotState } from "./SlotButton";
import { getBlockedSlots } from "./calendarUtils";

interface SchedulingModalProps {
  isOpen: boolean;
  selectedDate: Date | null;
  pets: Pet[];
  existingAppointments: Appointment[];
  onConfirm: (data: { slot: TimeSlot; type: AppointmentType; petId: string }) => void;
  onClose: () => void;
}

export default function SchedulingModal({
  isOpen,
  selectedDate,
  pets,
  existingAppointments,
  onConfirm,
  onClose,
}: SchedulingModalProps) {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [selectedType, setSelectedType] = useState<AppointmentType | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  // Reset form state when modal opens (new date selected)
  useEffect(() => {
    if (isOpen) {
      setSelectedSlot(null);
      setSelectedType(null);
      setSelectedPetId(pets.length === 1 ? pets[0].id : null);
    }
  }, [isOpen, selectedDate, pets]);

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !selectedDate) return null;

  // Convert selectedDate to YYYY-MM-DD
  const dateString = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;

  // Get blocked and occupied slots
  const blockedSlots = getBlockedSlots(dateString);
  const occupiedSlots = existingAppointments
    .filter((a) => a.date === dateString)
    .map((a) => a.slot);

  // Determine slot state
  const getSlotState = (slot: TimeSlot): SlotState => {
    if (slot === selectedSlot) return "selected";
    if (blockedSlots.includes(slot)) return "blocked";
    if (occupiedSlots.includes(slot)) return "occupied";
    return "available";
  };

  const handleSlotClick = (slot: TimeSlot) => {
    const state = getSlotState(slot);
    if (state === "blocked" || state === "occupied") return;
    setSelectedSlot(slot);
  };

  const isConfirmDisabled = !selectedSlot || !selectedType || !selectedPetId;

  const handleConfirm = () => {
    if (isConfirmDisabled) return;
    onConfirm({
      slot: selectedSlot!,
      type: selectedType!,
      petId: selectedPetId!,
    });
  };

  const handleBackdropClick = () => {
    onClose();
  };

  // Format date for display
  const formattedDate = selectedDate.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="scheduling-modal-title"
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <h2
          id="scheduling-modal-title"
          className="text-lg font-semibold text-gray-900 mb-4 capitalize"
        >
          {formattedDate}
        </h2>

        {/* Time Slots */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Horários disponíveis
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {ALL_SLOTS.map((slot) => (
              <SlotButton
                key={slot}
                slot={slot}
                state={getSlotState(slot)}
                onClick={() => handleSlotClick(slot)}
              />
            ))}
          </div>
        </div>

        {/* Appointment Type */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Tipo de atendimento
          </h3>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="appointmentType"
                value="consulta"
                checked={selectedType === "consulta"}
                onChange={() => setSelectedType("consulta")}
                className="w-4 h-4 text-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              />
              <span className="text-sm text-gray-700">Consulta</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="appointmentType"
                value="exame"
                checked={selectedType === "exame"}
                onChange={() => setSelectedType("exame")}
                className="w-4 h-4 text-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              />
              <span className="text-sm text-gray-700">Exame</span>
            </label>
          </div>
        </div>

        {/* Pet Selector (only when >1 pet) */}
        {pets.length > 1 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Selecione o pet
            </h3>
            <select
              value={selectedPetId || ""}
              onChange={(e) => setSelectedPetId(e.target.value || null)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <option value="">Selecione um pet</option>
              {pets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Confirm Button */}
        <button
          type="button"
          disabled={isConfirmDisabled}
          onClick={handleConfirm}
          className={`
            w-full rounded-lg px-4 py-3 text-sm font-medium transition-colors
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
            ${
              isConfirmDisabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-primary-500 text-white hover:bg-primary-600"
            }
          `}
        >
          Confirmar agendamento
        </button>
      </div>
    </div>
  );
}
