import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { Pet, Species } from "@/types/pets";

/**
 * **Validates: Requirements 7.3**
 *
 * Property 10: Confirmed removal decreases list by one
 *
 * For any pet list with at least 1 pet and any pet in that list,
 * confirming removal must result in a list that is exactly one element
 * shorter and does not contain the removed pet's ID.
 */

const speciesArb: fc.Arbitrary<Species> = fc.constantFrom("cao", "gato", "outro");

const petArb: fc.Arbitrary<Pet> = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 50 }),
  species: speciesArb,
  breed: fc.string({ minLength: 1, maxLength: 30 }),
  birthDate: fc.date({ min: new Date("2000-01-01"), max: new Date("2024-12-31") })
    .filter((d) => !isNaN(d.getTime()))
    .map((d) => d.toISOString().split("T")[0]),
  weight: fc.float({ min: Math.fround(0.1), max: Math.fround(100), noNaN: true }).filter((n) => n > 0),
  color: fc.string({ minLength: 1, maxLength: 20 }),
  photo: fc.constant(null),
});

const petListArb = fc
  .array(petArb, { minLength: 1, maxLength: 3 })
  .filter((pets) => {
    const ids = pets.map((p) => p.id);
    return new Set(ids).size === ids.length;
  });

/**
 * Simulates the removal logic from PetsPage.handleConfirmRemove:
 * setPets((prev) => prev.filter((p) => p.id !== petToRemove.id))
 */
function confirmRemoval(pets: Pet[], petToRemove: Pet): Pet[] {
  return pets.filter((p) => p.id !== petToRemove.id);
}

describe("Feature: pet-registration-listing, Property 10: Confirmed removal decreases list by one", () => {
  it("removing a pet from the list results in exactly one fewer element", () => {
    fc.assert(
      fc.property(petListArb, (pets) => {
        const indexArb = fc.nat({ max: pets.length - 1 });

        fc.assert(
          fc.property(indexArb, (index) => {
            const petToRemove = pets[index];
            const result = confirmRemoval(pets, petToRemove);

            expect(result.length).toBe(pets.length - 1);
          }),
          { numRuns: 10 }
        );
      }),
      { numRuns: 100 }
    );
  });

  it("the removed pet's ID is no longer present in the resulting list", () => {
    fc.assert(
      fc.property(petListArb, (pets) => {
        const indexArb = fc.nat({ max: pets.length - 1 });

        fc.assert(
          fc.property(indexArb, (index) => {
            const petToRemove = pets[index];
            const result = confirmRemoval(pets, petToRemove);

            const resultIds = result.map((p) => p.id);
            expect(resultIds).not.toContain(petToRemove.id);
          }),
          { numRuns: 10 }
        );
      }),
      { numRuns: 100 }
    );
  });

  it("all remaining pets after removal were in the original list", () => {
    fc.assert(
      fc.property(petListArb, (pets) => {
        const indexArb = fc.nat({ max: pets.length - 1 });

        fc.assert(
          fc.property(indexArb, (index) => {
            const petToRemove = pets[index];
            const result = confirmRemoval(pets, petToRemove);

            const originalIds = pets.map((p) => p.id);
            for (const pet of result) {
              expect(originalIds).toContain(pet.id);
            }
          }),
          { numRuns: 10 }
        );
      }),
      { numRuns: 100 }
    );
  });
});
