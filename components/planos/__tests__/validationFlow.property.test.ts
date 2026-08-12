import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import {
  purchaseReducer,
  initialState,
  PurchaseState,
  StepErrors,
} from "../purchaseReducer";
import { planSelectionSchema, tutorSchema, petSchema } from "../schemas";

/**
 * Helper: maps a ZodError to StepErrors, mirroring the logic in PlanPurchaseFlow.
 */
function mapZodErrors(
  error: import("zod").ZodError,
  step: number
): StepErrors {
  const errors: StepErrors = {};

  switch (step) {
    case 1: {
      const planError = error.errors.find(
        (e) => e.path[0] === "selectedPlanId"
      );
      if (planError) {
        errors.plan = planError.message;
      }
      break;
    }
    case 2: {
      const tutorErrors: Partial<
        Record<"fullName" | "cpf" | "email" | "phone", string>
      > = {};
      for (const err of error.errors) {
        const field = err.path[0] as keyof typeof tutorErrors;
        if (field) {
          tutorErrors[field] = err.message;
        }
      }
      if (Object.keys(tutorErrors).length > 0) {
        errors.tutor = tutorErrors;
      }
      break;
    }
    case 3: {
      const petErrors: Partial<
        Record<"name" | "species" | "breed" | "birthDate" | "weight", string>
      > = {};
      for (const err of error.errors) {
        const field = err.path[0] as keyof typeof petErrors;
        if (field) {
          petErrors[field] = err.message;
        }
      }
      if (Object.keys(petErrors).length > 0) {
        errors.pet = petErrors;
      }
      break;
    }
  }

  return errors;
}

// --- Arbitraries for INVALID data ---

/**
 * Arbitrary for step 1 with invalid plan selection (empty or null).
 */
const invalidPlanState = fc.constantFrom(null, "").map(
  (planId): PurchaseState => ({
    ...initialState,
    currentStep: 1,
    selectedPlanId: planId,
  })
);

/**
 * Arbitrary for step 2 with at least one invalid tutor field.
 * Generates tutor data where at least one field is guaranteed invalid.
 */
const invalidTutorState = fc
  .record({
    fullName: fc.constantFrom("", "ab"), // less than 3 chars
    cpf: fc
      .array(fc.constantFrom("0", "1", "2", "3", "a", "b"), {
        minLength: 0,
        maxLength: 10,
      })
      .map((arr) => arr.join("")), // not exactly 11 digits
    email: fc.constantFrom("invalid", "noat.com", "@missing", "a@", ""),
    phone: fc
      .array(fc.constantFrom("0", "1", "a"), {
        minLength: 0,
        maxLength: 10,
      })
      .map((arr) => arr.join("")), // not exactly 11 digits
  })
  .map(
    (tutor): PurchaseState => ({
      ...initialState,
      currentStep: 2,
      tutorData: tutor,
    })
  );

/**
 * Arbitrary for step 3 with at least one invalid pet field.
 */
const invalidPetState = fc
  .record({
    name: fc.constant(""), // required but empty
    species: fc.constant("" as "" | "cao" | "gato"), // not in enum
    breed: fc.constant(""), // required but empty
    birthDate: fc.constant(""), // required but empty
    weight: fc.constantFrom("", "abc", "12.345", "-1"), // doesn't match pattern
  })
  .map(
    (pet): PurchaseState => ({
      ...initialState,
      currentStep: 3,
      petData: pet,
    })
  );

// --- Arbitraries for MIXED data (some valid, some invalid) ---

/**
 * Arbitrary for valid tutor fullName (3+ chars).
 */
const validFullName = fc.string({ minLength: 3, maxLength: 50 });

/**
 * Arbitrary for valid CPF (exactly 11 digits).
 */
const validCpf = fc
  .array(fc.constantFrom("0", "1", "2", "3", "4", "5", "6", "7", "8", "9"), {
    minLength: 11,
    maxLength: 11,
  })
  .map((arr) => arr.join(""));

/**
 * Arbitrary for invalid email.
 */
const invalidEmail = fc.constantFrom(
  "invalid",
  "noat.com",
  "@missing",
  "a@",
  "",
  "test@",
  "@@double.com"
);

/**
 * Arbitrary for invalid phone (not 11 digits).
 */
const invalidPhone = fc
  .array(fc.constantFrom("0", "1", "2", "3", "4", "5"), {
    minLength: 0,
    maxLength: 10,
  })
  .map((arr) => arr.join(""));

/**
 * State with valid fullName and cpf, but invalid email and phone.
 * Simulates partial validity for Property 12.
 */
const mixedTutorState = fc
  .tuple(validFullName, validCpf, invalidEmail, invalidPhone)
  .map(
    ([fullName, cpf, email, phone]): PurchaseState => ({
      ...initialState,
      currentStep: 2,
      tutorData: { fullName, cpf, email, phone },
    })
  );

/**
 * Valid pet name (non-empty, ≤50 chars).
 */
const validPetName = fc.string({ minLength: 1, maxLength: 50 });

/**
 * Valid species.
 */
const validSpecies = fc.constantFrom("cao" as const, "gato" as const);

/**
 * State with valid name and species, but invalid breed, birthDate, and weight.
 * Simulates partial validity for Property 12.
 */
const mixedPetState = fc
  .tuple(validPetName, validSpecies)
  .map(
    ([name, species]): PurchaseState => ({
      ...initialState,
      currentStep: 3,
      petData: {
        name,
        species,
        breed: "", // invalid: required
        birthDate: "", // invalid: required
        weight: "abc", // invalid: not numeric pattern
      },
    })
  );

describe("Validation Flow Property Tests", () => {
  /**
   * Property 11: Validation blocks advance on invalid data
   * Com dados inválidos, currentStep não muda e errors é populado.
   *
   * For any step with at least one field failing Zod schema validation,
   * attempting to advance SHALL NOT change currentStep and SHALL populate
   * the errors object with messages for the invalid fields.
   *
   * **Validates: Requirements 7.1, 7.2**
   */
  describe("Property 11: Validation blocks advance on invalid data", () => {
    it("Step 1: empty selectedPlanId blocks advance and populates errors", () => {
      fc.assert(
        fc.property(invalidPlanState, (state) => {
          // Validate with the schema (mimics handleNext logic)
          const result = planSelectionSchema.safeParse({
            selectedPlanId: state.selectedPlanId ?? "",
          });

          // Validation must fail
          expect(result.success).toBe(false);

          if (!result.success) {
            // Map errors and dispatch SET_ERRORS (mimics handleNext)
            const errors = mapZodErrors(result.error, 1);
            const nextState = purchaseReducer(state, {
              type: "SET_ERRORS",
              errors,
            });

            // currentStep must NOT change (NEXT_STEP was never dispatched)
            expect(nextState.currentStep).toBe(state.currentStep);

            // errors must be populated
            expect(nextState.errors.plan).toBeDefined();
            expect(typeof nextState.errors.plan).toBe("string");
            expect(nextState.errors.plan!.length).toBeGreaterThan(0);
          }
        })
      );
    });

    it("Step 2: invalid tutor data blocks advance and populates errors", () => {
      fc.assert(
        fc.property(invalidTutorState, (state) => {
          const result = tutorSchema.safeParse(state.tutorData);

          // Validation must fail
          expect(result.success).toBe(false);

          if (!result.success) {
            const errors = mapZodErrors(result.error, 2);
            const nextState = purchaseReducer(state, {
              type: "SET_ERRORS",
              errors,
            });

            // currentStep must NOT change
            expect(nextState.currentStep).toBe(state.currentStep);

            // tutor errors must be populated with at least one field error
            expect(nextState.errors.tutor).toBeDefined();
            expect(
              Object.keys(nextState.errors.tutor!).length
            ).toBeGreaterThan(0);
          }
        })
      );
    });

    it("Step 3: invalid pet data blocks advance and populates errors", () => {
      fc.assert(
        fc.property(invalidPetState, (state) => {
          const result = petSchema.safeParse(state.petData);

          // Validation must fail
          expect(result.success).toBe(false);

          if (!result.success) {
            const errors = mapZodErrors(result.error, 3);
            const nextState = purchaseReducer(state, {
              type: "SET_ERRORS",
              errors,
            });

            // currentStep must NOT change
            expect(nextState.currentStep).toBe(state.currentStep);

            // pet errors must be populated with at least one field error
            expect(nextState.errors.pet).toBeDefined();
            expect(
              Object.keys(nextState.errors.pet!).length
            ).toBeGreaterThan(0);
          }
        })
      );
    });
  });

  /**
   * Property 12: Valid fields preserved on validation failure
   * Campos válidos permanecem inalterados após falha de validação.
   *
   * For any form state where some fields are valid and others invalid,
   * after a failed validation attempt, all valid field values SHALL
   * remain unchanged in state.
   *
   * **Validates: Requirements 7.3**
   */
  describe("Property 12: Valid fields preserved on validation failure", () => {
    it("Step 2: valid fullName and cpf are preserved when email/phone fail validation", () => {
      fc.assert(
        fc.property(mixedTutorState, (state) => {
          const result = tutorSchema.safeParse(state.tutorData);

          // Should fail because email and phone are invalid
          expect(result.success).toBe(false);

          if (!result.success) {
            const errors = mapZodErrors(result.error, 2);
            const nextState = purchaseReducer(state, {
              type: "SET_ERRORS",
              errors,
            });

            // Valid fields remain unchanged
            expect(nextState.tutorData.fullName).toBe(state.tutorData.fullName);
            expect(nextState.tutorData.cpf).toBe(state.tutorData.cpf);

            // Invalid fields also remain unchanged (SET_ERRORS doesn't modify data)
            expect(nextState.tutorData.email).toBe(state.tutorData.email);
            expect(nextState.tutorData.phone).toBe(state.tutorData.phone);

            // The entire tutorData object is preserved
            expect(nextState.tutorData).toEqual(state.tutorData);
          }
        })
      );
    });

    it("Step 3: valid name and species are preserved when breed/birthDate/weight fail validation", () => {
      fc.assert(
        fc.property(mixedPetState, (state) => {
          const result = petSchema.safeParse(state.petData);

          // Should fail because breed, birthDate, weight are invalid
          expect(result.success).toBe(false);

          if (!result.success) {
            const errors = mapZodErrors(result.error, 3);
            const nextState = purchaseReducer(state, {
              type: "SET_ERRORS",
              errors,
            });

            // Valid fields remain unchanged
            expect(nextState.petData.name).toBe(state.petData.name);
            expect(nextState.petData.species).toBe(state.petData.species);

            // Invalid fields also remain unchanged (SET_ERRORS doesn't modify data)
            expect(nextState.petData.breed).toBe(state.petData.breed);
            expect(nextState.petData.birthDate).toBe(state.petData.birthDate);
            expect(nextState.petData.weight).toBe(state.petData.weight);

            // The entire petData object is preserved
            expect(nextState.petData).toEqual(state.petData);
          }
        })
      );
    });

    it("Step 1: selectedPlanId is preserved after SET_ERRORS", () => {
      fc.assert(
        fc.property(invalidPlanState, (state) => {
          const result = planSelectionSchema.safeParse({
            selectedPlanId: state.selectedPlanId ?? "",
          });

          expect(result.success).toBe(false);

          if (!result.success) {
            const errors = mapZodErrors(result.error, 1);
            const nextState = purchaseReducer(state, {
              type: "SET_ERRORS",
              errors,
            });

            // selectedPlanId remains unchanged
            expect(nextState.selectedPlanId).toBe(state.selectedPlanId);

            // All other data also remains unchanged
            expect(nextState.tutorData).toEqual(state.tutorData);
            expect(nextState.petData).toEqual(state.petData);
          }
        })
      );
    });
  });
});
