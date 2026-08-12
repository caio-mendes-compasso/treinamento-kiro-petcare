import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import {
  purchaseReducer,
  initialState,
  PurchaseState,
} from "../purchaseReducer";

/**
 * Arbitrary for valid steps where NEXT_STEP can advance (1, 2, or 3).
 */
const advanceableStep = fc.constantFrom(1, 2, 3) as fc.Arbitrary<1 | 2 | 3>;

/**
 * Arbitrary for valid steps where BACK can decrement (2, 3, or 4).
 */
const backableStep = fc.constantFrom(2, 3, 4) as fc.Arbitrary<2 | 3 | 4>;

/**
 * Arbitrary for species values used in SET_SPECIES.
 */
const speciesArb = fc.constantFrom("" as const, "cao" as const, "gato" as const);

/**
 * Arbitrary for non-empty breed strings.
 */
const nonEmptyBreed = fc.string({ minLength: 1, maxLength: 30 }).filter((s) => s.trim().length > 0);

/**
 * Arbitrary for tutor data with random values.
 */
const tutorDataArb = fc.record({
  fullName: fc.string({ minLength: 1, maxLength: 50 }),
  cpf: fc.string({ minLength: 1, maxLength: 11 }),
  email: fc.string({ minLength: 1, maxLength: 50 }),
  phone: fc.string({ minLength: 1, maxLength: 11 }),
});

/**
 * Arbitrary for pet data with random values.
 */
const petDataArb = fc.record({
  name: fc.string({ minLength: 1, maxLength: 50 }),
  species: speciesArb,
  breed: fc.string({ maxLength: 30 }),
  birthDate: fc.string({ maxLength: 10 }),
  weight: fc.string({ maxLength: 5 }),
});

/**
 * Arbitrary for non-empty plan IDs.
 */
const planIdArb = fc.string({ minLength: 1, maxLength: 20 }).filter((s) => s.trim().length > 0);

describe("Purchase Reducer Property Tests", () => {
  /**
   * Property 2: Advance transitions to next step
   * NEXT_STEP com step N ∈ {1,2,3} produz currentStep N+1.
   *
   * **Validates: Requirements 1.3**
   */
  it("Property 2: NEXT_STEP with step N in {1,2,3} produces currentStep N+1", () => {
    fc.assert(
      fc.property(advanceableStep, (step) => {
        const state: PurchaseState = { ...initialState, currentStep: step };
        const nextState = purchaseReducer(state, { type: "NEXT_STEP" });

        expect(nextState.currentStep).toBe(step + 1);
      })
    );
  });

  /**
   * Property 3: Back preserves data and decrements step
   * BACK com step N ∈ {2,3,4} produz currentStep N-1 preservando tutorData, petData e selectedPlanId.
   *
   * **Validates: Requirements 1.4**
   */
  it("Property 3: BACK with step N in {2,3,4} produces currentStep N-1 and preserves data", () => {
    fc.assert(
      fc.property(backableStep, tutorDataArb, petDataArb, planIdArb, (step, tutorData, petData, planId) => {
        const state: PurchaseState = {
          ...initialState,
          currentStep: step,
          tutorData,
          petData,
          selectedPlanId: planId,
        };

        const nextState = purchaseReducer(state, { type: "BACK" });

        // Step decrements
        expect(nextState.currentStep).toBe(step - 1);

        // Data preserved
        expect(nextState.tutorData).toEqual(tutorData);
        expect(nextState.petData).toEqual(petData);
        expect(nextState.selectedPlanId).toBe(planId);
      })
    );
  });

  /**
   * Property 4: Plan selection invariant — exactly one selected
   * Qualquer sequência de SELECT_PLAN resulta em exatamente um selectedPlanId (o último selecionado).
   *
   * **Validates: Requirements 2.2, 2.3**
   */
  it("Property 4: Any sequence of SELECT_PLAN actions results in exactly one selectedPlanId (the last one)", () => {
    fc.assert(
      fc.property(
        fc.array(planIdArb, { minLength: 1, maxLength: 10 }),
        (planIds) => {
          const finalState = planIds.reduce(
            (state, planId) => purchaseReducer(state, { type: "SELECT_PLAN", planId }),
            initialState
          );

          // selectedPlanId is the last one dispatched
          expect(finalState.selectedPlanId).toBe(planIds[planIds.length - 1]);

          // It's not null (exactly one selected)
          expect(finalState.selectedPlanId).not.toBeNull();
        }
      )
    );
  });

  /**
   * Property 9: Species change resets breed
   * SET_SPECIES sempre limpa breed para string vazia.
   *
   * **Validates: Requirements 4.5**
   */
  it("Property 9: SET_SPECIES always resets petData.breed to empty string", () => {
    fc.assert(
      fc.property(nonEmptyBreed, speciesArb, (breed, species) => {
        const state: PurchaseState = {
          ...initialState,
          petData: { ...initialState.petData, breed },
        };

        const nextState = purchaseReducer(state, { type: "SET_SPECIES", species });

        expect(nextState.petData.breed).toBe("");
      })
    );
  });
});
