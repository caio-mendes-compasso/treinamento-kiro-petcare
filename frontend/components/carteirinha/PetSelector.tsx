"use client";

import { Pet } from "@/types/pets";

interface PetSelectorProps {
  pets: Pet[];
  selectedPetId: string;
  onSelectPet: (petId: string) => void;
}

export default function PetSelector({
  pets,
  selectedPetId,
  onSelectPet,
}: PetSelectorProps) {
  return (
    <div
      role="tablist"
      aria-label="Selecionar pet"
      className="flex flex-wrap gap-2"
    >
      {pets.map((pet) => {
        const isActive = pet.id === selectedPetId;

        return (
          <button
            key={pet.id}
            role="tab"
            type="button"
            id={`tab-pet-${pet.id}`}
            aria-selected={isActive}
            aria-controls={`panel-pet-${pet.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onSelectPet(pet.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              isActive
                ? "bg-primary-500 text-white"
                : "text-gray-700 hover:bg-primary-50"
            }`}
          >
            {pet.name}
          </button>
        );
      })}
    </div>
  );
}
