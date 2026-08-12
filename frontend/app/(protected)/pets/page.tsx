"use client";

import { useState } from "react";
import { Pet } from "@/types/pets";
import { usePets } from "@/contexts/PetsContext";
import PetGrid from "@/components/pets/PetGrid";
import PetForm from "@/components/pets/PetForm";
import RemoveDialog from "@/components/pets/RemoveDialog";

const MAX_PETS = 3;

export default function PetsPage() {
  const { pets, addPet, removePet } = usePets();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [petToRemove, setPetToRemove] = useState<Pet | null>(null);

  const canAddPet = pets.length < MAX_PETS;

  const handleAddPet = (newPet: Omit<Pet, "id">) => {
    addPet(newPet);
    setIsFormOpen(false);
  };

  const handleConfirmRemove = () => {
    if (petToRemove) {
      removePet(petToRemove.id);
      setPetToRemove(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Meus Pets</h1>
          <p className="text-gray-500 text-sm mt-1">
            {pets.length} de {MAX_PETS} pets cadastrados
          </p>
        </div>

        {canAddPet && (
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="bg-primary-500 text-white hover:bg-primary-600 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
          >
            Adicionar Pet
          </button>
        )}
      </div>

      {pets.length === MAX_PETS && (
        <p className="text-amber-600 text-sm">
          Limite máximo de 3 pets por plano atingido.
        </p>
      )}

      <PetForm
        isOpen={isFormOpen}
        onSubmit={handleAddPet}
        onCancel={() => setIsFormOpen(false)}
      />

      <PetGrid pets={pets} onRemovePet={(pet) => setPetToRemove(pet)} />

      <RemoveDialog
        pet={petToRemove}
        isOpen={petToRemove !== null}
        onConfirm={handleConfirmRemove}
        onCancel={() => setPetToRemove(null)}
      />
    </div>
  );
}
