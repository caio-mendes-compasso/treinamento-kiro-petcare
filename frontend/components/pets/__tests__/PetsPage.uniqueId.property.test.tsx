import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { Pet, Species } from "@/types/pets";

/**
 * Property 9: Generated IDs are unique
 *
 * For any sequence of N pet additions (N ≤ 3), all generated pet IDs must be
 * distinct from each other and from any pre-existing pet IDs in the list.
 *
 * **Validates: Requirements 6.3**
 */

/**
 * Simulates the handleAddPet logic from PetsPage.
 * Each call generates a new Pet with a unique ID via crypto.randomUUID().
 */
function simulateAddPet(
  currentPets: Pet[],
  newPetData: Omit<Pet, "id">
): Pet[] {
  const pet: Pet = { ...newPetData, id: crypto.randomUUID() };
  return [...currentPets, pet];
}

const speciesArb: fc.Arbitrary<Species> = fc.constantFrom("cao", "gato", "outro");

const petDataArb: fc.Arbitrary<Omit<Pet, "id">> = fc.record({
  name: fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0),
  species: speciesArb,
  breed: fc.string({ minLength: 1, maxLength: 30 }).filter((s) => s.trim().length > 0),
  birthDate: fc.constantFrom("2020-01-15", "2021-06-10", "2022-12-01"),
  weight: fc.double({ min: 0.1, max: 100, noNaN: true }),
  color: fc.string({ minLength: 1, maxLength: 30 }).filter((s) => s.trim().length > 0),
  photo: fc.constantFrom(null, "data:image/png;base64,abc123"),
});

const preExistingPetArb: fc.Arbitrary<Pet> = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0),
  species: speciesArb,
  breed: fc.string({ minLength: 1, maxLength: 30 }).filter((s) => s.trim().length > 0),
  birthDate: fc.constantFrom("2019-03-20", "2020-08-05", "2021-11-30"),
  weight: fc.double({ min: 0.1, max: 100, noNaN: true }),
  color: fc.string({ minLength: 1, maxLength: 30 }).filter((s) => s.trim().length > 0),
  photo: fc.constantFrom(null, "data:image/png;base64,xyz789"),
});

describe("PetsPage Unique ID Generation Property Tests", () => {
  /**
   * Property 9: Generated IDs are unique
   *
   * For any sequence of N pet additions (N ≤ 3), all generated pet IDs must be
   * distinct from each other and from any pre-existing pet IDs in the list.
   *
   * **Validates: Requirements 6.3**
   */
  it("Property 9: All generated pet IDs are distinct from each other and from pre-existing IDs", () => {
    fc.assert(
      fc.property(
        fc.array(preExistingPetArb, { minLength: 0, maxLength: 2 }),
        fc.array(petDataArb, { minLength: 1, maxLength: 3 }),
        (preExistingPets, newPetsData) => {
          // Simulate adding N pets sequentially
          let pets = [...preExistingPets];
          for (const petData of newPetsData) {
            pets = simulateAddPet(pets, petData);
          }

          // Collect all IDs
          const allIds = pets.map((p) => p.id);

          // All IDs must be distinct (no duplicates)
          const uniqueIds = new Set(allIds);
          expect(uniqueIds.size).toBe(allIds.length);

          // Verify newly generated IDs are UUID format
          const newIds = allIds.slice(preExistingPets.length);
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
          for (const id of newIds) {
            expect(id).toMatch(uuidRegex);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
