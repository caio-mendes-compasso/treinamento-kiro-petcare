import { Pet, Species } from "@/types/pets";

interface PetCardProps {
  pet: Pet;
  onRemove: (pet: Pet) => void;
}

const speciesEmoji: Record<Species, string> = {
  cao: "🐕",
  gato: "🐈",
  outro: "🐾",
};

const speciesLabel: Record<Species, string> = {
  cao: "Cão",
  gato: "Gato",
  outro: "Outro",
};

export default function PetCard({ pet, onRemove }: PetCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center gap-4">
        {pet.photo ? (
          <img
            src={pet.photo}
            alt={`Foto de ${pet.name}`}
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center text-3xl">
            {speciesEmoji[pet.species]}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="text-gray-900 font-semibold truncate">{pet.name}</h3>
          <p className="text-gray-700">{speciesLabel[pet.species]}</p>
          <p className="text-gray-500 text-sm truncate">{pet.breed}</p>
        </div>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => onRemove(pet)}
          className="border border-primary-500 text-primary-500 hover:bg-primary-50 px-4 py-2 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
        >
          Remover
        </button>
      </div>
    </div>
  );
}
