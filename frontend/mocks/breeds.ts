import { Species } from "@/types/pets";

export const breedsBySpecies: Record<Species, string[]> = {
  cao: ["Golden Retriever", "Labrador", "Bulldog", "Poodle", "SRD"],
  gato: ["Siamês", "Persa", "Maine Coon", "SRD"],
  outro: [], // texto livre
};
