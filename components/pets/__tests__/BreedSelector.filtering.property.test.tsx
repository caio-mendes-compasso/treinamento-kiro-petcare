import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import BreedSelector from "@/components/pets/BreedSelector";
import { breedsBySpecies } from "@/mocks/breeds";

/**
 * Property 2: Breed filtering matches species data
 *
 * For any species value in {"cao", "gato"}, the BreedSelector options rendered
 * must equal exactly the array of breeds defined for that species in BreedsData.
 *
 * **Validates: Requirements 3.3, 3.4**
 */
describe("BreedSelector - Property 2: Breed filtering matches species data", () => {
  it("rendered options (excluding placeholder) match exactly breedsBySpecies[species]", () => {
    const speciesArb = fc.constantFrom("cao" as const, "gato" as const);

    fc.assert(
      fc.property(speciesArb, (species) => {
        const { container } = render(
          <BreedSelector species={species} value="" onChange={() => {}} />
        );

        const select = container.querySelector("select");
        expect(select).not.toBeNull();

        const options = Array.from(select!.querySelectorAll("option"));
        // Remove the placeholder option ("Selecione a raça")
        const breedOptions = options
          .filter((opt) => opt.value !== "")
          .map((opt) => opt.textContent);

        expect(breedOptions).toEqual(breedsBySpecies[species]);
      })
    );
  });
});
