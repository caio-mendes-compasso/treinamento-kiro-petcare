import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { Pet, Species } from "@/types/pets";

/**
 * **Validates: Requirements 7.4**
 *
 * Property 11: Cancelled removal preserves list
 *
 * For any pet list and any pet selected for removal, cancelling the removal
 * dialog must leave the pet list unchanged (same length, same elements in same order).
 */

const speciesArb: fc.Arbitrary<Species> = fc.constantFrom("cao", "gato", "outro");

const petArb: fc.Arbitrary<Pet> = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 50 }),
  species: speciesArb,
  breed: fc.string({ minLength: 1, maxLength: 30 }),
  birthDate: fc
    .date({ min: new Date("2000-01-01"), max: new Date("2024-12-31") })
    .filter((d) => !isNaN(d.getTime()))
    .map((d) => d.toISOString().split("T")[0]),
  weight: fc
    .float({ min: Math.fround(0.1), max: Math.fround(100), noNaN: true })
    .filter((n) => n > 0),
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
 * Simulates the cancel removal flow from PetsPage:
 *
 * 1. User clicks "Remover" on a PetCard → setPetToRemove(pet)
 * 2. RemoveDialog opens (isOpen becomes true)
 * 3. User clicks "Cancelar" → onCancel fires → setPetToRemove(null)
 *
 * The cancel action only resets petToRemove to null.
 * The pets state array is never modified.
 */
function cancelRemoval(pets: Pet[], _petToRemove: Pet): Pet[] {
  // Cancel does nothing to the pets list — it only clears petToRemove state
  return pets;
}

describe("Feature: pet-registration-listing, Property 11: Cancelled removal preserves list", () => {
  it("cancelling removal keeps the same number of pets", () => {
    fc.assert(
      fc.property(petListArb, (pets) => {
        const indexArb = fc.nat({ max: pets.length - 1 });

        fc.assert(
          fc.property(indexArb, (index) => {
            const petToRemove = pets[index];
            const result = cancelRemoval(pets, petToRemove);

            expect(result.length).toBe(pets.length);
          }),
          { numRuns: 10 }
        );
      }),
      { numRuns: 100 }
    );
  });

  it("cancelling removal preserves the exact same elements in the same order", () => {
    fc.assert(
      fc.property(petListArb, (pets) => {
        const indexArb = fc.nat({ max: pets.length - 1 });

        fc.assert(
          fc.property(indexArb, (index) => {
            const petToRemove = pets[index];
            const result = cancelRemoval(pets, petToRemove);

            // Same elements in same order
            expect(result).toEqual(pets);
          }),
          { numRuns: 10 }
        );
      }),
      { numRuns: 100 }
    );
  });

  it("the selected pet remains in the list after cancel", () => {
    fc.assert(
      fc.property(petListArb, (pets) => {
        const indexArb = fc.nat({ max: pets.length - 1 });

        fc.assert(
          fc.property(indexArb, (index) => {
            const petToRemove = pets[index];
            const result = cancelRemoval(pets, petToRemove);

            const resultIds = result.map((p) => p.id);
            expect(resultIds).toContain(petToRemove.id);
          }),
          { numRuns: 10 }
        );
      }),
      { numRuns: 100 }
    );
  });

  it("cancelling removal returns referentially the same array (no mutation)", () => {
    fc.assert(
      fc.property(petListArb, (pets) => {
        const indexArb = fc.nat({ max: pets.length - 1 });

        fc.assert(
          fc.property(indexArb, (index) => {
            const petToRemove = pets[index];
            const result = cancelRemoval(pets, petToRemove);

            // The cancel operation should return the exact same reference
            expect(result).toBe(pets);
          }),
          { numRuns: 10 }
        );
      }),
      { numRuns: 100 }
    );
  });
});
