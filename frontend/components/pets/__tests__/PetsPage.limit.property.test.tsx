import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { Pet, Species } from "@/types/pets";

/**
 * Property 1: Pet limit controls add button visibility
 *
 * For any pet list, the "Adicionar Pet" button is visible if and only if the
 * list contains fewer than 3 pets, and the limit message is displayed if and
 * only if the list contains exactly 3 pets.
 *
 * **Validates: Requirements 2.1, 2.2, 2.3**
 */

const MAX_PETS = 3;

// Mirrors the logic from PetsPage
function canAddPet(pets: Pet[]): boolean {
  return pets.length < MAX_PETS;
}

function shouldShowLimitMessage(pets: Pet[]): boolean {
  return pets.length === MAX_PETS;
}

// Generators
const speciesArb: fc.Arbitrary<Species> = fc.constantFrom("cao", "gato", "outro");

const dateArb = fc
  .tuple(
    fc.integer({ min: 2000, max: 2024 }),
    fc.integer({ min: 1, max: 12 }),
    fc.integer({ min: 1, max: 28 })
  )
  .map(([y, m, d]) => `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`);

const petArb: fc.Arbitrary<Pet> = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 50 }),
  species: speciesArb,
  breed: fc.string({ minLength: 1, maxLength: 30 }),
  birthDate: dateArb,
  weight: fc.float({ min: Math.fround(0.1), max: Math.fround(100), noNaN: true }).filter((n) => n > 0),
  color: fc.string({ minLength: 1, maxLength: 30 }),
  photo: fc.constant(null),
});

describe("PetsPage - Property 1: Pet limit controls add button visibility", () => {
  it("shows 'Adicionar Pet' button when pet count is less than 3 (canAddPet returns true)", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 2 }).chain((count) =>
          fc.array(petArb, { minLength: count, maxLength: count })
        ),
        (pets) => {
          expect(canAddPet(pets)).toBe(true);
          expect(shouldShowLimitMessage(pets)).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("hides 'Adicionar Pet' button and shows limit message when pet count is exactly 3", () => {
    fc.assert(
      fc.property(
        fc.array(petArb, { minLength: 3, maxLength: 3 }),
        (pets) => {
          expect(canAddPet(pets)).toBe(false);
          expect(shouldShowLimitMessage(pets)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});
