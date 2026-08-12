import { describe, it, expect, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import * as fc from "fast-check";
import { render, cleanup, within } from "@testing-library/react";
import PetSelector from "@/components/carteirinha/PetSelector";
import PlanCardBack from "@/components/carteirinha/PlanCardBack";
import { Pet, Species } from "@/types/pets";

/**
 * **Validates: Requirements 5.3**
 *
 * Property 7: Selecting a pet updates the card with that pet's information
 *
 * For any list of pets with more than one pet, and for any pet selected from
 * that list, the card SHALL display the selected pet's name, species, and breed.
 */

afterEach(() => {
  cleanup();
});

// --- Generators ---

const speciesArb: fc.Arbitrary<Species> = fc.constantFrom("cao", "gato", "outro");

const speciesLabel: Record<Species, string> = {
  cao: "Cão",
  gato: "Gato",
  outro: "Outro",
};

// Generate a list of pets with guaranteed unique IDs and unique names
const petsListArb: fc.Arbitrary<Pet[]> = fc
  .integer({ min: 2, max: 5 })
  .chain((count) => {
    const petArbs = Array.from({ length: count }, (_, i) =>
      fc.record({
        id: fc.constant(`pet-id-${i}-${Date.now()}-${Math.random().toString(36).slice(2)}`),
        name: fc.constant(`Pet_${String.fromCharCode(65 + i)}`), // Pet_A, Pet_B, Pet_C...
        species: speciesArb,
        breed: fc.stringMatching(/^[A-Za-z]{1,15}$/).filter((s) => s.length > 0),
        birthDate: fc.constant("2020-01-01"),
        weight: fc.float({ min: 0.5, max: 50, noNaN: true }),
        color: fc.constant("marrom"),
        photo: fc.constantFrom(null, "data:image/png;base64,abc123"),
      })
    );
    return fc.tuple(...petArbs).map((pets) => pets as Pet[]);
  });

describe("Property 7: Selecting a pet updates the card with that pet's information", () => {
  it("PetSelector shows the selected pet tab as active (aria-selected=true)", () => {
    fc.assert(
      fc.property(petsListArb, (pets) => {
        // Pick a random pet from the list to be selected
        const selectedPet = pets[Math.floor(Math.random() * pets.length)];

        const { container, unmount } = render(
          <PetSelector
            pets={pets}
            selectedPetId={selectedPet.id}
            onSelectPet={() => {}}
          />
        );

        const tablist = within(container).getByRole("tablist");
        const selectedTab = within(tablist).getByRole("tab", { name: selectedPet.name });
        expect(selectedTab).toHaveAttribute("aria-selected", "true");

        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it("PlanCardBack displays the selected pet's species label", () => {
    fc.assert(
      fc.property(petsListArb, (pets) => {
        const selectedPet = pets[Math.floor(Math.random() * pets.length)];

        const { container, unmount } = render(<PlanCardBack pet={selectedPet} />);

        const expectedSpeciesLabel = speciesLabel[selectedPet.species];
        expect(container.textContent).toContain(expectedSpeciesLabel);

        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it("PlanCardBack displays the selected pet's breed", () => {
    fc.assert(
      fc.property(petsListArb, (pets) => {
        const selectedPet = pets[Math.floor(Math.random() * pets.length)];

        const { container, unmount } = render(<PlanCardBack pet={selectedPet} />);

        expect(container.textContent).toContain(selectedPet.breed);

        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it("selecting any pet from the list renders correct species and breed together", () => {
    fc.assert(
      fc.property(
        petsListArb.chain((pets) =>
          fc.integer({ min: 0, max: pets.length - 1 }).map((idx) => ({
            pets,
            selectedIndex: idx,
          }))
        ),
        ({ pets, selectedIndex }) => {
          const selectedPet = pets[selectedIndex];

          const { container, unmount } = render(
            <div>
              <PetSelector
                pets={pets}
                selectedPetId={selectedPet.id}
                onSelectPet={() => {}}
              />
              <PlanCardBack pet={selectedPet} />
            </div>
          );

          // Verify the selected tab is marked active
          const tablist = within(container).getByRole("tablist");
          const activeTab = within(tablist).getByRole("tab", {
            name: selectedPet.name,
          });
          expect(activeTab).toHaveAttribute("aria-selected", "true");

          // Verify card shows species and breed of the selected pet
          const expectedSpeciesLabel = speciesLabel[selectedPet.species];
          expect(container.textContent).toContain(expectedSpeciesLabel);
          expect(container.textContent).toContain(selectedPet.breed);

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});
