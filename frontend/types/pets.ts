export type Species = "cao" | "gato" | "outro";

export interface Pet {
  id: string;
  name: string;
  species: Species;
  breed: string;
  birthDate: string; // ISO date string (YYYY-MM-DD)
  weight: number;
  color: string;
  photo: string | null; // base64 data URL ou null
}
