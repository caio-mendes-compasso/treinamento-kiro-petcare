"use client";

import { Pet, Species } from "@/types/pets";

interface PlanCardBackProps {
  pet: Pet;
}

const speciesLabel: Record<Species, string> = {
  cao: "Cão",
  gato: "Gato",
  outro: "Outro",
};

const speciesEmoji: Record<Species, string> = {
  cao: "🐕",
  gato: "🐈",
  outro: "🐾",
};

export default function PlanCardBack({ pet }: PlanCardBackProps) {
  return (
    <div
      className="w-full rounded-xl p-6 text-white flex flex-col justify-between"
      style={{
        aspectRatio: "1.6 / 1",
        background: "linear-gradient(135deg, #064345 0%, #0D7377 50%, #095B5E 100%)",
      }}
      aria-label={`Verso da carteirinha do pet ${pet.name}`}
    >
      {/* Top section: Pet photo + info */}
      <div className="flex items-center gap-4">
        {pet.photo ? (
          <img
            src={pet.photo}
            alt={`Foto de ${pet.name}`}
            className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-white/30"
          />
        ) : (
          <div
            className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl md:text-4xl border-2 border-white/30"
            aria-label="Placeholder da foto do pet"
          >
            {speciesEmoji[pet.species]}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="text-white/70 text-xs uppercase tracking-wide">Espécie</p>
          <p className="text-white font-semibold text-sm md:text-base">
            {speciesLabel[pet.species]}
          </p>
          <p className="text-white/70 text-xs uppercase tracking-wide mt-1">Raça</p>
          <p className="text-white font-semibold text-sm md:text-base truncate">
            {pet.breed}
          </p>
        </div>
      </div>

      {/* Bottom section: Emergency phone + QR Code */}
      <div className="flex items-end justify-between mt-4">
        <div>
          <p className="text-white/70 text-xs uppercase tracking-wide">
            Emergência
          </p>
          <p className="text-white font-bold text-sm md:text-base">
            0800-PET-CARE
          </p>
        </div>

        {/* QR Code Placeholder */}
        <div
          className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-md flex items-center justify-center"
          aria-label="QR Code"
        >
          <div className="grid grid-cols-4 grid-rows-4 gap-0.5 w-10 h-10 md:w-12 md:h-12">
            {/* Simple QR code pattern */}
            <div className="bg-gray-900 col-span-2 row-span-2 rounded-sm" />
            <div className="bg-gray-900" />
            <div className="bg-white" />
            <div className="bg-white" />
            <div className="bg-gray-900" />
            <div className="bg-gray-900 col-span-2 row-span-2 rounded-sm" />
            <div className="bg-gray-900" />
            <div className="bg-white" />
            <div className="bg-white" />
            <div className="bg-gray-900" />
          </div>
        </div>
      </div>
    </div>
  );
}
