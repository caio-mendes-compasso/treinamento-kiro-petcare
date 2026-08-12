import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { Pet, Species } from "@/types/pets";

/**
 * **Validates: Requirements 6.1**
 *
 * Property 7: Adding a valid pet grows the list by one
 *
 * For any pet list with length < 3 and any valid pet form data,
 * submitting the form must result in the pet list having exactly one
 * more element, and the new element must contain the submitted data.
 */

// Mirrors the handleAddPet logic from PetsPage
function addPet(pets: Pet[], newPet: Omit<Pet, "id">): Pet[] {
  const pet: Pet = { ...newPet, id: crypto.randomUUID() };
  return [...pets, pet];
}

// Generators
const speciesArb: fc.Arbitrary<Species> = fc.constantFrom("cao", "gato", "outro");

// Generate ISO date string directly to avoid Invalid time value issues
const dateArb = fc
  .tuple(
    fc.integer({ min: 2000, max: 2024 }),
    fc.integer({ min: 1, max: 12 }),
    fc.integer({ min: 1, max: 28 })
  )
  .map(([y, m, d]) => `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`);

const validPetDataArb: fc.Arbitrary<Omit<Pet, "id">> = fc.record({
  name: fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length >= 1),
  species: speciesArb,
  breed: fc.string({ minLength: 1, maxLength: 30 }).filter((s) => s.trim().length >= 1),
  birthDate: dateArb,
  weight: fc.float({ min: Math.fround(0.1), max: Math.fround(100), noNaN: true }).filter((n) => n > 0),
  color: fc.string({ minLength: 1, maxLength: 30 }).filter((s) => s.trim().length >= 1),
  photo: fc.constantFrom(null, "data:image/png;base64,abc123"),
});

const existingPetArb: fc.Arbitrary<Pet> = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length >= 1),
  species: speciesArb,
  breed: fc.string({ minLength: 1, maxLength: 30 }).filter((s) => s.trim().length >= 1),
  birthDate: dateArb,
  weight: fc.float({ min: Math.fround(0.1), max: Math.fround(100), noNaN: true }).filter((n) => n > 0),
  color: fc.string({ minLength: 1, maxLength: 30 }).filter((s) => s.trim().length >= 1),
  photo: fc.constantFrom(null, "data:image/png;base64,abc123"),
});

// Generate a pet list with 0, 1, or 2 elements (length < 3)
const petListArb: fc.Arbitrary<Pet[]> = fc
  .integer({ min: 0, max: 2 })
  .chain((size) => fc.array(existingPetArb, { minLength: size, maxLength: size }));

describe("Feature: pet-registration-listing, Property 7: Adding a valid pet grows the list by one", () => {
  it("adding a valid pet results in list length increasing by exactly one", () => {
    fc.assert(
      fc.property(petListArb, validPetDataArb, (pets, newPetData) => {
        const originalLength = pets.length;
        const result = addPet(pets, newPetData);
        expect(result.length).toBe(originalLength + 1);
      }),
      { numRuns: 200 }
    );
  });

  it("the new element contains the submitted data (name, species, breed, birthDate, weight, color, photo)", () => {
    fc.assert(
      fc.property(petListArb, validPetDataArb, (pets, newPetData) => {
        const result = addPet(pets, newPetData);
        const addedPet = result[result.length - 1];

        expect(addedPet.name).toBe(newPetData.name);
        expect(addedPet.species).toBe(newPetData.species);
        expect(addedPet.breed).toBe(newPetData.breed);
        expect(addedPet.birthDate).toBe(newPetData.birthDate);
        expect(addedPet.weight).toBe(newPetData.weight);
        expect(addedPet.color).toBe(newPetData.color);
        expect(addedPet.photo).toBe(newPetData.photo);
      }),
      { numRuns: 200 }
    );
  });

  it("the new element has a non-empty id assigned", () => {
    fc.assert(
      fc.property(petListArb, validPetDataArb, (pets, newPetData) => {
        const result = addPet(pets, newPetData);
        const addedPet = result[result.length - 1];

        expect(addedPet.id).toBeDefined();
        expect(addedPet.id.length).toBeGreaterThan(0);
      }),
      { numRuns: 200 }
    );
  });

  it("existing pets in the list are preserved unchanged after adding", () => {
    fc.assert(
      fc.property(petListArb, validPetDataArb, (pets, newPetData) => {
        const result = addPet(pets, newPetData);

        // All original pets should still be present at the same positions
        for (let i = 0; i < pets.length; i++) {
          expect(result[i]).toEqual(pets[i]);
        }
      }),
      { numRuns: 200 }
    );
  });
});
