import { describe, it, expect, afterEach } from "vitest";
import * as fc from "fast-check";
import { render, cleanup, screen, fireEvent } from "@testing-library/react";
import PlanCardFront from "@/components/carteirinha/PlanCardFront";
import PlanCardBack from "@/components/carteirinha/PlanCardBack";
import PlanCard from "@/components/carteirinha/PlanCard";
import { Pet, Species } from "@/types/pets";
import { Plan } from "@/mocks/plans";

afterEach(() => {
  cleanup();
});

// ============================================================
// Property 8: Card front displays all required identification fields
// ============================================================

/**
 * **Validates: Requirements 6.2**
 *
 * Property 8: Card front displays all required identification fields
 *
 * For any combination of pet, plan, and user, the card front SHALL contain:
 * the text "Pet Care", the plan name, the user's name, the pet's name,
 * a plan number matching the format PC-2025-XXXXXX, and a validity date.
 */

// --- Generators for Property 8 ---

const alphaStringArb = (prefix: string) =>
  fc
    .stringMatching(/^[A-Za-z]{2,15}$/)
    .map((s) => `${prefix}_${s}`);

const hexColorArb = fc
  .tuple(
    fc.integer({ min: 0, max: 255 }),
    fc.integer({ min: 0, max: 255 }),
    fc.integer({ min: 0, max: 255 })
  )
  .map(
    ([r, g, b]) =>
      `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
  );

const planNumberArb = fc
  .integer({ min: 100000, max: 999999 })
  .map((n) => `PC-2025-${n}`);

const validUntilArb = fc
  .tuple(
    fc.integer({ min: 2025, max: 2030 }),
    fc.integer({ min: 1, max: 12 }),
    fc.integer({ min: 1, max: 28 })
  )
  .map(
    ([y, m, d]) =>
      `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y}`
  );

const planCardFrontPropsArb = fc
  .tuple(
    alphaStringArb("Plan"),
    hexColorArb,
    alphaStringArb("User"),
    alphaStringArb("Pet"),
    planNumberArb,
    validUntilArb
  )
  .map(([planName, planColor, userName, petName, planNumber, validUntil]) => ({
    planName,
    planColor,
    userName,
    petName,
    planNumber,
    validUntil,
  }));

describe("Property 8: Card front displays all required identification fields", () => {
  it('contains the text "Pet Care"', () => {
    fc.assert(
      fc.property(planCardFrontPropsArb, (props) => {
        const { container } = render(<PlanCardFront {...props} />);

        expect(container.textContent).toContain("Pet Care");

        cleanup();
      }),
      { numRuns: 100 }
    );
  });

  it("contains the plan name", () => {
    fc.assert(
      fc.property(planCardFrontPropsArb, (props) => {
        const { container } = render(<PlanCardFront {...props} />);

        expect(container.textContent).toContain(props.planName);

        cleanup();
      }),
      { numRuns: 100 }
    );
  });

  it("contains the user's name", () => {
    fc.assert(
      fc.property(planCardFrontPropsArb, (props) => {
        const { container } = render(<PlanCardFront {...props} />);

        expect(container.textContent).toContain(props.userName);

        cleanup();
      }),
      { numRuns: 100 }
    );
  });

  it("contains the pet's name", () => {
    fc.assert(
      fc.property(planCardFrontPropsArb, (props) => {
        const { container } = render(<PlanCardFront {...props} />);

        expect(container.textContent).toContain(props.petName);

        cleanup();
      }),
      { numRuns: 100 }
    );
  });

  it("contains a plan number matching the format PC-2025-XXXXXX", () => {
    fc.assert(
      fc.property(planCardFrontPropsArb, (props) => {
        const { container } = render(<PlanCardFront {...props} />);

        expect(container.textContent).toContain(props.planNumber);
        expect(props.planNumber).toMatch(/^PC-2025-\d{6}$/);

        cleanup();
      }),
      { numRuns: 100 }
    );
  });

  it("contains a validity date", () => {
    fc.assert(
      fc.property(planCardFrontPropsArb, (props) => {
        const { container } = render(<PlanCardFront {...props} />);

        expect(container.textContent).toContain(props.validUntil);

        cleanup();
      }),
      { numRuns: 100 }
    );
  });
});

// ============================================================
// Property 9: Card back displays pet info and emergency data
// ============================================================

/**
 * **Validates: Requirements 7.1, 7.2, 7.3**
 *
 * Property 9: Card back displays pet info and emergency data
 *
 * For any pet, the card back SHALL display: the pet's species, the pet's breed,
 * the emergency phone "0800-PET-CARE", and a QR code placeholder.
 * If the pet has a photo (non-null), the photo SHALL be displayed;
 * otherwise a placeholder SHALL be shown.
 */

// --- Generators for Property 9 ---

const speciesArb: fc.Arbitrary<Species> = fc.constantFrom("cao", "gato", "outro");

const speciesLabelMap: Record<Species, string> = {
  cao: "Cão",
  gato: "Gato",
  outro: "Outro",
};

const petNameArb = fc.stringMatching(/^[A-Za-z]{2,15}$/).map((s) => `Pet_${s}`);
const breedArb = fc.stringMatching(/^[A-Za-z]{3,20}$/).map((s) => `Breed_${s}`);

const petWithPhotoArb: fc.Arbitrary<Pet> = fc.record({
  id: fc.uuid(),
  name: petNameArb,
  species: speciesArb,
  breed: breedArb,
  birthDate: fc.constant("2020-05-15"),
  weight: fc.float({ min: 0.5, max: 80, noNaN: true }),
  color: fc.constant("marrom"),
  photo: fc.constant("data:image/png;base64,iVBORw0KGgoAAAANSUhEUg=="),
});

const petWithoutPhotoArb: fc.Arbitrary<Pet> = fc.record({
  id: fc.uuid(),
  name: petNameArb,
  species: speciesArb,
  breed: breedArb,
  birthDate: fc.constant("2020-05-15"),
  weight: fc.float({ min: 0.5, max: 80, noNaN: true }),
  color: fc.constant("marrom"),
  photo: fc.constant(null),
});

const petArb: fc.Arbitrary<Pet> = fc.oneof(petWithPhotoArb, petWithoutPhotoArb);

describe("Property 9: Card back displays pet info and emergency data", () => {
  it("displays the species label mapped correctly for any pet", () => {
    fc.assert(
      fc.property(petArb, (pet) => {
        const { container } = render(<PlanCardBack pet={pet} />);

        const expectedLabel = speciesLabelMap[pet.species];
        expect(container.textContent).toContain(expectedLabel);

        cleanup();
      }),
      { numRuns: 100 }
    );
  });

  it("displays the breed text for any pet", () => {
    fc.assert(
      fc.property(petArb, (pet) => {
        const { container } = render(<PlanCardBack pet={pet} />);

        expect(container.textContent).toContain(pet.breed);

        cleanup();
      }),
      { numRuns: 100 }
    );
  });

  it("displays emergency phone 0800-PET-CARE for any pet", () => {
    fc.assert(
      fc.property(petArb, (pet) => {
        const { container } = render(<PlanCardBack pet={pet} />);

        expect(container.textContent).toContain("0800-PET-CARE");

        cleanup();
      }),
      { numRuns: 100 }
    );
  });

  it("displays QR Code placeholder for any pet", () => {
    fc.assert(
      fc.property(petArb, (pet) => {
        render(<PlanCardBack pet={pet} />);

        expect(screen.getByLabelText("QR Code")).toBeDefined();

        cleanup();
      }),
      { numRuns: 100 }
    );
  });

  it("displays pet photo when photo is not null", () => {
    fc.assert(
      fc.property(petWithPhotoArb, (pet) => {
        render(<PlanCardBack pet={pet} />);

        const img = screen.getByAltText(`Foto de ${pet.name}`);
        expect(img).toBeDefined();
        expect((img as HTMLImageElement).src).toBe(pet.photo);

        cleanup();
      }),
      { numRuns: 100 }
    );
  });

  it("displays placeholder when photo is null", () => {
    fc.assert(
      fc.property(petWithoutPhotoArb, (pet) => {
        render(<PlanCardBack pet={pet} />);

        expect(screen.getByLabelText("Placeholder da foto do pet")).toBeDefined();

        cleanup();
      }),
      { numRuns: 100 }
    );
  });

  it("photo is shown iff pet.photo is non-null (biconditional)", () => {
    fc.assert(
      fc.property(petArb, (pet) => {
        render(<PlanCardBack pet={pet} />);

        const hasPhoto = screen.queryByAltText(`Foto de ${pet.name}`) !== null;
        const hasPlaceholder =
          screen.queryByLabelText("Placeholder da foto do pet") !== null;

        if (pet.photo !== null) {
          expect(hasPhoto).toBe(true);
          expect(hasPlaceholder).toBe(false);
        } else {
          expect(hasPhoto).toBe(false);
          expect(hasPlaceholder).toBe(true);
        }

        cleanup();
      }),
      { numRuns: 100 }
    );
  });
});

// ============================================================
// Property 10: Double flip returns card to original side
// ============================================================

/**
 * **Validates: Requirements 8.1**
 *
 * Property 10: Double flip returns card to original side
 *
 * For any initial card state (front or back), flipping twice SHALL return
 * the card to its original visible side. Equivalently, flipping is its own
 * inverse: flip(flip(state)) === state.
 */

// --- Generators for Property 10 ---

const petForFlipArb: fc.Arbitrary<Pet> = fc.record({
  id: fc.uuid(),
  name: fc.stringMatching(/^[A-Za-z]{2,15}$/),
  species: speciesArb,
  breed: fc.stringMatching(/^[A-Za-z]{3,15}$/),
  birthDate: fc.constant("2020-01-01"),
  weight: fc.float({ min: 1, max: 50, noNaN: true }),
  color: fc.constant("preto"),
  photo: fc.constantFrom(null, "data:image/png;base64,abc123"),
});

const planForFlipArb: fc.Arbitrary<Plan> = fc.record({
  id: fc.constantFrom("basico", "plus", "premium"),
  name: fc.constantFrom("Básico", "Plus", "Premium"),
  price: fc.constantFrom(49.9, 89.9, 149.9),
  priceLabel: fc.constantFrom("R$ 49,90/mês", "R$ 89,90/mês", "R$ 149,90/mês"),
  features: fc.constant(["Consultas", "Vacinas"]),
  highlighted: fc.boolean(),
});

const userNameForFlipArb = fc.stringMatching(/^[A-Za-z]{2,20}$/);

describe("Property 10: Double flip returns card to original side", () => {
  it("clicking twice returns the card to the original (front) state", () => {
    fc.assert(
      fc.property(petForFlipArb, planForFlipArb, userNameForFlipArb, (pet, plan, userName) => {
        const { container } = render(
          <PlanCard pet={pet} plan={plan} userName={userName} />
        );

        const cardInner = container.querySelector(
          '[style*="transform-style: preserve-3d"]'
        ) as HTMLElement;

        expect(cardInner).not.toBeNull();
        expect(cardInner.style.transform).toBe("rotateY(0deg)");

        const clickable = container.querySelector('[role="button"]') as HTMLElement;
        expect(clickable).not.toBeNull();

        fireEvent.click(clickable);
        expect(cardInner.style.transform).toBe("rotateY(180deg)");

        fireEvent.click(clickable);
        expect(cardInner.style.transform).toBe("rotateY(0deg)");

        cleanup();
      }),
      { numRuns: 100 }
    );
  });

  it("any even number of clicks returns to original side", () => {
    fc.assert(
      fc.property(
        petForFlipArb,
        planForFlipArb,
        userNameForFlipArb,
        fc.integer({ min: 1, max: 10 }),
        (pet, plan, userName, numDoubleClicks) => {
          const { container } = render(
            <PlanCard pet={pet} plan={plan} userName={userName} />
          );

          const cardInner = container.querySelector(
            '[style*="transform-style: preserve-3d"]'
          ) as HTMLElement;

          const clickable = container.querySelector('[role="button"]') as HTMLElement;

          const totalClicks = numDoubleClicks * 2;
          for (let i = 0; i < totalClicks; i++) {
            fireEvent.click(clickable);
          }

          expect(cardInner.style.transform).toBe("rotateY(0deg)");

          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  it("any odd number of clicks keeps the card flipped", () => {
    fc.assert(
      fc.property(
        petForFlipArb,
        planForFlipArb,
        userNameForFlipArb,
        fc.integer({ min: 0, max: 9 }),
        (pet, plan, userName, n) => {
          const { container } = render(
            <PlanCard pet={pet} plan={plan} userName={userName} />
          );

          const cardInner = container.querySelector(
            '[style*="transform-style: preserve-3d"]'
          ) as HTMLElement;

          const clickable = container.querySelector('[role="button"]') as HTMLElement;

          const totalClicks = 2 * n + 1;
          for (let i = 0; i < totalClicks; i++) {
            fireEvent.click(clickable);
          }

          expect(cardInner.style.transform).toBe("rotateY(180deg)");

          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });
});
