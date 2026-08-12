import { Species } from "@/types/pets";
import { breedsBySpecies } from "@/mocks/breeds";

interface BreedSelectorProps {
  species: Species;
  value: string;
  onChange: (breed: string) => void;
  error?: string;
}

export default function BreedSelector({ species, value, onChange, error }: BreedSelectorProps) {
  const baseClasses =
    "w-full rounded-lg border px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2";
  const borderClass = error ? "border-red-500" : "border-gray-200";

  if (species === "outro") {
    return (
      <div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Digite a raça"
          className={`${baseClasses} ${borderClass}`}
          aria-invalid={!!error}
          aria-describedby={error ? "breed-error" : undefined}
        />
        {error && (
          <p id="breed-error" className="text-red-500 text-sm mt-1">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${baseClasses} ${borderClass}`}
        aria-invalid={!!error}
        aria-describedby={error ? "breed-error" : undefined}
      >
        <option value="">Selecione a raça</option>
        {breedsBySpecies[species].map((breed) => (
          <option key={breed} value={breed}>
            {breed}
          </option>
        ))}
      </select>
      {error && (
        <p id="breed-error" className="text-red-500 text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
