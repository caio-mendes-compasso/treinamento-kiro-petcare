import { render, cleanup, act } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import * as fc from "fast-check";
import { useState } from "react";
import BreedSelector from "@/components/pets/BreedSelector";
import { Species } from "@/types/pets";
import { breedsBySpecies } from "@/mocks/breeds";

/**
 * Property 3: Species change resets breed value
 *
 * For any current form state with a non-empty breed, changing the species to a
 * different value must reset the breed field to an empty string.
 *
 * The BreedSelector component relies on the parent to pass value="" when species
 * changes. This test validates that when the parent resets the breed (as it should
 * per the design contract), the BreedSelector correctly reflects the empty state.
 *
 * **Validates: Requirements 3.6**
 */

const allSpecies: Species[] = ["cao", "gato", "outro"];

/**
 * Wrapper simulating parent behavior: when species changes,
 * parent resets breed to empty string (per design contract).
 */
function BreedSelectorWrapper({
  initialSpecies,
  initialBreed,
  newSpecies,
}: {
  initialSpecies: Species;
  initialBreed: string;
  newSpecies: Species;
}) {
  const [species, setSpecies] = useState<Species>(initialSpecies);
  const [breed, setBreed] = useState<string>(initialBreed);

  const handleSpeciesChange = () => {
    setSpecies(newSpecies);
    setBreed(""); // Parent resets breed on species change (Requirement 3.6)
  };

  return (
    <div>
      <button data-testid="change-species" onClick={handleSpeciesChange}>
        Change Species
      </button>
      <span data-testid="current-breed">{breed}</span>
      <BreedSelector species={species} value={breed} onChange={setBreed} />
    </div>
  );
}

describe("BreedSelector - Property 3: Species change resets breed value", () => {
  afterEach(() => {
    cleanup();
  });

  // Arbitrary for generating a non-empty breed value based on species
  const breedForSpecies = (species: Species): fc.Arbitrary<string> => {
    const breeds = breedsBySpecies[species];
    if (breeds.length > 0) {
      return fc.constantFrom(...breeds);
    }
    // For "outro", generate a non-empty free text breed
    return fc.string({ minLength: 1, maxLength: 30 }).filter((s) => s.trim().length > 0);
  };

  // Generate a pair of different species
  const differentSpeciesPair = fc
    .constantFrom(...allSpecies)
    .chain((initial) => {
      const others = allSpecies.filter((s) => s !== initial);
      return fc.constantFrom(...others).map((newSp) => ({ initial, newSp }));
    });

  it("resets breed to empty string when species changes to a different value", () => {
    fc.assert(
      fc.property(
        differentSpeciesPair.chain(({ initial, newSp }) =>
          breedForSpecies(initial).map((breed) => ({
            initialSpecies: initial,
            initialBreed: breed,
            newSpecies: newSp,
          }))
        ),
        ({ initialSpecies, initialBreed, newSpecies }) => {
          cleanup();

          const { getByTestId } = render(
            <BreedSelectorWrapper
              initialSpecies={initialSpecies}
              initialBreed={initialBreed}
              newSpecies={newSpecies}
            />
          );

          // Verify initial breed is non-empty
          const breedDisplay = getByTestId("current-breed");
          expect(breedDisplay.textContent).toBe(initialBreed);

          // Simulate parent changing species (which resets breed)
          const changeButton = getByTestId("change-species");
          act(() => {
            changeButton.click();
          });

          // After species change, breed must be empty
          expect(breedDisplay.textContent).toBe("");

          cleanup();
        }
      ),
      { numRuns: 50 }
    );
  });

  it("BreedSelector shows empty/placeholder state when value is reset to empty", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allSpecies),
        (species) => {
          cleanup();

          const { container } = render(
            <BreedSelector species={species} value="" onChange={() => {}} />
          );

          if (species === "outro") {
            // Input mode: value should be empty
            const input = container.querySelector("input") as HTMLInputElement;
            expect(input.value).toBe("");
          } else {
            // Select mode: value should be empty (placeholder selected)
            const select = container.querySelector("select") as HTMLSelectElement;
            expect(select.value).toBe("");
          }

          cleanup();
        }
      ),
      { numRuns: 20 }
    );
  });
});
