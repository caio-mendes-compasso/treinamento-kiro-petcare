import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fc from "fast-check";
import { render, act } from "@testing-library/react";
import React from "react";
import { PetsProvider, usePets } from "@/contexts/PetsContext";
import { Pet, Species } from "@/types/pets";

/**
 * **Validates: Requirements 8.2, 8.4**
 *
 * Property 16: PetsContext localStorage round-trip
 *
 * For any valid list of pets, persisting to localStorage and then
 * initializing PetsContext SHALL produce the same list of pets with
 * all fields preserved.
 */

const STORAGE_KEY = "petcare_pets";

// --- Arbitraries ---

const speciesArb: fc.Arbitrary<Species> = fc.constantFrom("cao", "gato", "outro");

const dateArb = fc
  .tuple(
    fc.integer({ min: 2000, max: 2024 }),
    fc.integer({ min: 1, max: 12 }),
    fc.integer({ min: 1, max: 28 })
  )
  .map(
    ([y, m, d]) =>
      `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`
  );

const petArb: fc.Arbitrary<Pet> = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 30 }).filter((s) => s.trim().length >= 1),
  species: speciesArb,
  breed: fc.string({ minLength: 1, maxLength: 30 }).filter((s) => s.trim().length >= 1),
  birthDate: dateArb,
  weight: fc.float({ min: Math.fround(0.1), max: Math.fround(100), noNaN: true }).filter((n) => n > 0),
  color: fc.string({ minLength: 1, maxLength: 20 }).filter((s) => s.trim().length >= 1),
  photo: fc.constantFrom(null, "data:image/png;base64,abc123"),
});

const petListArb: fc.Arbitrary<Pet[]> = fc.array(petArb, {
  minLength: 0,
  maxLength: 10,
});

// --- Helper component to read context values ---

function PetsConsumer({
  contextRef,
}: {
  contextRef: React.MutableRefObject<ReturnType<typeof usePets> | null>;
}) {
  const ctx = usePets();
  contextRef.current = ctx;
  return null;
}

// --- Tests ---

describe("Feature: agenda-calendar-scheduling, Property 16: PetsContext localStorage round-trip", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it(
    "persisting pets to localStorage and initializing PetsContext produces the same list",
    { timeout: 120000 },
    async () => {
      await fc.assert(
        fc.asyncProperty(petListArb, async (pets) => {
          // Clean localStorage between iterations
          localStorage.clear();

          // Phase 1: Store pets in localStorage
          localStorage.setItem(STORAGE_KEY, JSON.stringify(pets));

          // Phase 2: Mount PetsProvider and read via usePets()
          const contextRef: React.MutableRefObject<ReturnType<typeof usePets> | null> = {
            current: null,
          };

          const { unmount } = render(
            <PetsProvider>
              <PetsConsumer contextRef={contextRef} />
            </PetsProvider>
          );

          // Wait for useEffect to load from localStorage
          await act(async () => {});

          // Phase 3: Verify loaded pets match stored pets
          expect(contextRef.current!.pets).toEqual(pets);

          unmount();
        }),
        { numRuns: 100 }
      );
    }
  );

  it(
    "round-trip preserves every pet field exactly (id, name, species, breed, birthDate, weight, color, photo)",
    { timeout: 120000 },
    async () => {
      await fc.assert(
        fc.asyncProperty(petListArb, async (pets) => {
          localStorage.clear();
          localStorage.setItem(STORAGE_KEY, JSON.stringify(pets));

          const contextRef: React.MutableRefObject<ReturnType<typeof usePets> | null> = {
            current: null,
          };

          const { unmount } = render(
            <PetsProvider>
              <PetsConsumer contextRef={contextRef} />
            </PetsProvider>
          );

          await act(async () => {});

          const loaded = contextRef.current!.pets;
          expect(loaded.length).toBe(pets.length);

          for (let i = 0; i < pets.length; i++) {
            expect(loaded[i].id).toBe(pets[i].id);
            expect(loaded[i].name).toBe(pets[i].name);
            expect(loaded[i].species).toBe(pets[i].species);
            expect(loaded[i].breed).toBe(pets[i].breed);
            expect(loaded[i].birthDate).toBe(pets[i].birthDate);
            expect(loaded[i].weight).toBe(pets[i].weight);
            expect(loaded[i].color).toBe(pets[i].color);
            expect(loaded[i].photo).toBe(pets[i].photo);
          }

          unmount();
        }),
        { numRuns: 100 }
      );
    }
  );

  it(
    "PetsContext persists pets back to localStorage after loading (write-through)",
    { timeout: 120000 },
    async () => {
      await fc.assert(
        fc.asyncProperty(petListArb, async (pets) => {
          localStorage.clear();
          localStorage.setItem(STORAGE_KEY, JSON.stringify(pets));

          const contextRef: React.MutableRefObject<ReturnType<typeof usePets> | null> = {
            current: null,
          };

          const { unmount } = render(
            <PetsProvider>
              <PetsConsumer contextRef={contextRef} />
            </PetsProvider>
          );

          await act(async () => {});

          // Verify that localStorage still has the same data after context initialization
          const storedAfter = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
          expect(storedAfter).toEqual(pets);

          unmount();
        }),
        { numRuns: 100 }
      );
    }
  );
});
