"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePets } from "@/contexts/PetsContext";
import { useAuth } from "@/contexts/AuthContext";
import { userSubscription } from "@/mocks/subscription";
import PetSelector from "@/components/carteirinha/PetSelector";
import PlanCard from "@/components/carteirinha/PlanCard";

export default function CarteirinhaPage() {
  const { pets } = usePets();
  const { user } = useAuth();
  const [selectedPetId, setSelectedPetId] = useState<string>("");

  useEffect(() => {
    if (pets.length > 0 && !selectedPetId) {
      setSelectedPetId(pets[0].id);
    }
  }, [pets, selectedPetId]);

  const selectedPet = pets.find((p) => p.id === selectedPetId);

  const handleDownload = () => {
    window.alert("Download da carteirinha iniciado com sucesso!");
  };

  if (pets.length === 0) {
    return (
      <main className="space-y-8">
        <h1 className="text-2xl font-semibold text-gray-900">Carteirinha</h1>
        <div className="text-center py-12">
          <p className="text-gray-700 mb-4">
            Nenhum pet cadastrado. Cadastre um pet para ver a carteirinha.
          </p>
          <Link
            href="/pets"
            className="text-primary-500 hover:text-primary-600 underline focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
          >
            Cadastrar pet
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900">Carteirinha</h1>

      {pets.length > 1 && (
        <PetSelector
          pets={pets}
          selectedPetId={selectedPetId}
          onSelectPet={setSelectedPetId}
        />
      )}

      {selectedPet && (
        <div
          role="tabpanel"
          id={`panel-pet-${selectedPet.id}`}
          aria-labelledby={`tab-pet-${selectedPet.id}`}
        >
          <PlanCard
            pet={selectedPet}
            plan={userSubscription.plan}
            userName={user?.nome ?? "Tutor"}
          />
        </div>
      )}

      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleDownload}
          className="bg-primary-500 text-white hover:bg-primary-600 px-6 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Baixar Carteirinha
        </button>
      </div>
    </main>
  );
}
