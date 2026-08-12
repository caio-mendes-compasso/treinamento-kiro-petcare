import { Pet } from "@/types/pets";
import PetCard from "./PetCard";

interface PetGridProps {
  pets: Pet[];
  onRemovePet: (pet: Pet) => void;
}

export default function PetGrid({ pets, onRemovePet }: PetGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {pets.map((pet) => (
        <PetCard key={pet.id} pet={pet} onRemove={onRemovePet} />
      ))}
    </div>
  );
}
