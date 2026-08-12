"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Pet } from "@/types/pets";
import { initialPets } from "@/mocks/pets";

interface PetsContextType {
  pets: Pet[];
  addPet: (pet: Omit<Pet, "id">) => void;
  removePet: (id: string) => void;
}

const PetsContext = createContext<PetsContextType>({
  pets: [],
  addPet: () => {},
  removePet: () => {},
});

const STORAGE_KEY = "petcare_pets";

export function PetsProvider({ children }: { children: ReactNode }) {
  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPets(JSON.parse(stored));
      } else {
        setPets(initialPets);
      }
    } catch {
      setPets(initialPets);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pets));
    } catch {
      // localStorage unavailable
    }
  }, [pets]);

  const addPet = (newPet: Omit<Pet, "id">) => {
    const pet: Pet = { ...newPet, id: crypto.randomUUID() };
    setPets((prev) => [...prev, pet]);
  };

  const removePet = (id: string) => {
    setPets((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <PetsContext.Provider value={{ pets, addPet, removePet }}>
      {children}
    </PetsContext.Provider>
  );
}

export function usePets(): PetsContextType {
  return useContext(PetsContext);
}
