"use client";

import { breedsBySpecies } from "@/mocks/breeds";
import { PetData, PurchaseAction } from "./purchaseReducer";

interface PetStepProps {
  petData: PetData;
  errors?: Partial<Record<keyof PetData, string>>;
  dispatch: React.Dispatch<PurchaseAction>;
}

export default function PetStep({ petData, errors, dispatch }: PetStepProps) {
  const baseInputClasses =
    "w-full rounded-lg border px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const normalBorder = "border-gray-200 focus:ring-primary-500";
  const errorBorder = "border-red-500 focus:ring-red-500";

  function inputClasses(field: keyof PetData) {
    return `${baseInputClasses} ${errors?.[field] ? errorBorder : normalBorder}`;
  }

  return (
    <div className="space-y-4">
      {/* Nome do Pet */}
      <div>
        <label htmlFor="pet-name" className="block text-sm font-medium text-gray-700 mb-1">
          Nome do pet
        </label>
        <input
          id="pet-name"
          type="text"
          required
          value={petData.name}
          onChange={(e) =>
            dispatch({ type: "SET_PET_FIELD", field: "name", value: e.target.value })
          }
          className={inputClasses("name")}
        />
        {errors?.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      {/* Espécie */}
      <div>
        <label htmlFor="pet-species" className="block text-sm font-medium text-gray-700 mb-1">
          Espécie
        </label>
        <select
          id="pet-species"
          required
          value={petData.species}
          onChange={(e) =>
            dispatch({
              type: "SET_SPECIES",
              species: e.target.value as "" | "cao" | "gato",
            })
          }
          className={inputClasses("species")}
        >
          <option value="">Selecione a espécie</option>
          <option value="cao">Cão</option>
          <option value="gato">Gato</option>
        </select>
        {errors?.species && (
          <p className="text-red-500 text-sm mt-1">{errors.species}</p>
        )}
      </div>

      {/* Raça */}
      <div>
        <label htmlFor="pet-breed" className="block text-sm font-medium text-gray-700 mb-1">
          Raça
        </label>
        <select
          id="pet-breed"
          required
          value={petData.breed}
          disabled={!petData.species}
          onChange={(e) =>
            dispatch({ type: "SET_PET_FIELD", field: "breed", value: e.target.value })
          }
          className={`${inputClasses("breed")} ${!petData.species ? "bg-gray-100 cursor-not-allowed" : ""}`}
        >
          <option value="">Selecione a raça</option>
          {petData.species &&
            breedsBySpecies[petData.species].map((breed) => (
              <option key={breed} value={breed}>
                {breed}
              </option>
            ))}
        </select>
        {errors?.breed && (
          <p className="text-red-500 text-sm mt-1">{errors.breed}</p>
        )}
      </div>

      {/* Data de Nascimento */}
      <div>
        <label htmlFor="pet-birthdate" className="block text-sm font-medium text-gray-700 mb-1">
          Data de nascimento
        </label>
        <input
          id="pet-birthdate"
          type="date"
          required
          value={petData.birthDate}
          onChange={(e) =>
            dispatch({ type: "SET_PET_FIELD", field: "birthDate", value: e.target.value })
          }
          className={inputClasses("birthDate")}
        />
        {errors?.birthDate && (
          <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>
        )}
      </div>

      {/* Peso */}
      <div>
        <label htmlFor="pet-weight" className="block text-sm font-medium text-gray-700 mb-1">
          Peso (kg)
        </label>
        <input
          id="pet-weight"
          type="text"
          required
          value={petData.weight}
          onChange={(e) =>
            dispatch({ type: "SET_PET_FIELD", field: "weight", value: e.target.value })
          }
          className={inputClasses("weight")}
        />
        {errors?.weight && (
          <p className="text-red-500 text-sm mt-1">{errors.weight}</p>
        )}
      </div>
    </div>
  );
}
