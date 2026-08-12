"use client";

import { useState } from "react";
import { Pet, Species } from "@/types/pets";
import BreedSelector from "./BreedSelector";
import PhotoUpload from "./PhotoUpload";
import { petFormSchema, PetFormData } from "./petSchema";

interface PetFormProps {
  isOpen: boolean;
  onSubmit: (pet: Omit<Pet, "id">) => void;
  onCancel: () => void;
}

export default function PetForm({ isOpen, onSubmit, onCancel }: PetFormProps) {
  const [name, setName] = useState("");
  const [species, setSpecies] = useState<Species | "">("");
  const [breed, setBreed] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [weight, setWeight] = useState("");
  const [color, setColor] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof PetFormData, string>>>({});

  if (!isOpen) return null;

  function handleSpeciesChange(value: string) {
    setSpecies(value as Species);
    setBreed("");
    setErrors((prev) => ({ ...prev, species: undefined, breed: undefined }));
  }

  function resetForm() {
    setName("");
    setSpecies("");
    setBreed("");
    setBirthDate("");
    setWeight("");
    setColor("");
    setPhoto(null);
    setErrors({});
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const formData = {
      name,
      species,
      breed,
      birthDate,
      weight,
      color,
    };

    const result = petFormSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof PetFormData, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof PetFormData;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    const petData: Omit<Pet, "id"> = {
      name: result.data.name,
      species: result.data.species,
      breed: result.data.breed,
      birthDate: result.data.birthDate,
      weight: parseFloat(result.data.weight),
      color: result.data.color,
      photo,
    };

    onSubmit(petData);
    resetForm();
  }

  function handleCancel() {
    resetForm();
    onCancel();
  }

  const inputBaseClasses =
    "w-full rounded-lg border px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2";

  function inputClasses(field: keyof PetFormData) {
    return `${inputBaseClasses} ${errors[field] ? "border-red-500" : "border-gray-200"}`;
  }

  return (
    <div className="overflow-hidden transition-all duration-300 ease-in-out">
      <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
        {/* Nome */}
        <div>
          <label htmlFor="pet-name" className="block text-sm font-medium text-gray-700 mb-1">
            Nome
          </label>
          <input
            id="pet-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            placeholder="Nome do pet"
            className={inputClasses("name")}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Espécie */}
        <div>
          <label htmlFor="pet-species" className="block text-sm font-medium text-gray-700 mb-1">
            Espécie
          </label>
          <select
            id="pet-species"
            value={species}
            onChange={(e) => handleSpeciesChange(e.target.value)}
            className={inputClasses("species")}
          >
            <option value="">Selecione a espécie</option>
            <option value="cao">Cão</option>
            <option value="gato">Gato</option>
            <option value="outro">Outro</option>
          </select>
          {errors.species && <p className="text-red-500 text-sm mt-1">{errors.species}</p>}
        </div>

        {/* Raça */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Raça
          </label>
          <BreedSelector
            species={(species || "outro") as Species}
            value={breed}
            onChange={(value) => {
              setBreed(value);
              setErrors((prev) => ({ ...prev, breed: undefined }));
            }}
            error={errors.breed}
          />
        </div>

        {/* Data de Nascimento */}
        <div>
          <label htmlFor="pet-birthdate" className="block text-sm font-medium text-gray-700 mb-1">
            Data de Nascimento
          </label>
          <input
            id="pet-birthdate"
            type="date"
            value={birthDate}
            onChange={(e) => {
              setBirthDate(e.target.value);
              setErrors((prev) => ({ ...prev, birthDate: undefined }));
            }}
            className={inputClasses("birthDate")}
          />
          {errors.birthDate && <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>}
        </div>

        {/* Peso */}
        <div>
          <label htmlFor="pet-weight" className="block text-sm font-medium text-gray-700 mb-1">
            Peso (kg)
          </label>
          <input
            id="pet-weight"
            type="text"
            inputMode="decimal"
            value={weight}
            onChange={(e) => {
              setWeight(e.target.value);
              setErrors((prev) => ({ ...prev, weight: undefined }));
            }}
            placeholder="Ex: 5.5"
            className={inputClasses("weight")}
          />
          {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
        </div>

        {/* Cor/Pelagem */}
        <div>
          <label htmlFor="pet-color" className="block text-sm font-medium text-gray-700 mb-1">
            Cor/Pelagem
          </label>
          <input
            id="pet-color"
            type="text"
            value={color}
            onChange={(e) => {
              setColor(e.target.value);
              setErrors((prev) => ({ ...prev, color: undefined }));
            }}
            placeholder="Ex: Dourado, Preto e branco"
            className={inputClasses("color")}
          />
          {errors.color && <p className="text-red-500 text-sm mt-1">{errors.color}</p>}
        </div>

        {/* Upload de Foto */}
        <PhotoUpload value={photo} onChange={setPhoto} />

        {/* Botões */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="bg-primary-500 text-white hover:bg-primary-600 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
          >
            Cadastrar Pet
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
