import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { petFormSchema } from "@/components/pets/petSchema";

/**
 * **Validates: Requirements 5.1, 5.2, 5.3, 5.4**
 *
 * Property 6: Pet form schema validation round-trip
 *
 * For any form data object where all required fields contain valid values
 * (name 1–50 chars, species in enum, breed non-empty, birthDate non-empty,
 * weight as positive number string, color non-empty), the Zod schema must
 * pass validation. Conversely, for any form data missing or containing invalid
 * values in at least one required field, the schema must fail with a
 * field-specific error message.
 */

const validSpecies = fc.constantFrom("cao", "gato", "outro") as fc.Arbitrary<
  "cao" | "gato" | "outro"
>;

const validName = fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length >= 1);

const validBreed = fc.string({ minLength: 1, maxLength: 30 }).filter((s) => s.trim().length >= 1);

const validBirthDate = fc.string({ minLength: 1, maxLength: 20 }).filter((s) => s.trim().length >= 1);

const validWeight = fc
  .float({ min: Math.fround(0.01), max: Math.fround(999), noNaN: true })
  .filter((n) => n > 0)
  .map((n) => n.toFixed(2));

const validColor = fc.string({ minLength: 1, maxLength: 30 }).filter((s) => s.trim().length >= 1);

const validFormData = fc.record({
  name: validName,
  species: validSpecies,
  breed: validBreed,
  birthDate: validBirthDate,
  weight: validWeight,
  color: validColor,
});

describe("Feature: pet-registration-listing, Property 6: Pet form schema validation round-trip", () => {
  it("accepts any form data where all required fields contain valid values", () => {
    fc.assert(
      fc.property(validFormData, (data) => {
        const result = petFormSchema.safeParse(data);
        expect(result.success).toBe(true);
      }),
      { numRuns: 200 }
    );
  });

  it("rejects form data with empty name", () => {
    fc.assert(
      fc.property(validFormData, (data) => {
        const invalid = { ...data, name: "" };
        const result = petFormSchema.safeParse(invalid);
        expect(result.success).toBe(false);
        if (!result.success) {
          const nameErrors = result.error.issues.filter((i) => i.path.includes("name"));
          expect(nameErrors.length).toBeGreaterThan(0);
        }
      }),
      { numRuns: 100 }
    );
  });

  it("rejects form data with name exceeding 50 characters", () => {
    const longName = fc.string({ minLength: 51, maxLength: 100 });

    fc.assert(
      fc.property(validFormData, longName, (data, name) => {
        const invalid = { ...data, name };
        const result = petFormSchema.safeParse(invalid);
        expect(result.success).toBe(false);
        if (!result.success) {
          const nameErrors = result.error.issues.filter((i) => i.path.includes("name"));
          expect(nameErrors.length).toBeGreaterThan(0);
        }
      }),
      { numRuns: 100 }
    );
  });

  it("rejects form data with invalid species", () => {
    const invalidSpecies = fc
      .string({ minLength: 1, maxLength: 20 })
      .filter((s) => !["cao", "gato", "outro"].includes(s));

    fc.assert(
      fc.property(validFormData, invalidSpecies, (data, species) => {
        const invalid = { ...data, species };
        const result = petFormSchema.safeParse(invalid);
        expect(result.success).toBe(false);
        if (!result.success) {
          const speciesErrors = result.error.issues.filter((i) => i.path.includes("species"));
          expect(speciesErrors.length).toBeGreaterThan(0);
        }
      }),
      { numRuns: 100 }
    );
  });

  it("rejects form data with empty breed", () => {
    fc.assert(
      fc.property(validFormData, (data) => {
        const invalid = { ...data, breed: "" };
        const result = petFormSchema.safeParse(invalid);
        expect(result.success).toBe(false);
        if (!result.success) {
          const breedErrors = result.error.issues.filter((i) => i.path.includes("breed"));
          expect(breedErrors.length).toBeGreaterThan(0);
        }
      }),
      { numRuns: 100 }
    );
  });

  it("rejects form data with empty birthDate", () => {
    fc.assert(
      fc.property(validFormData, (data) => {
        const invalid = { ...data, birthDate: "" };
        const result = petFormSchema.safeParse(invalid);
        expect(result.success).toBe(false);
        if (!result.success) {
          const dateErrors = result.error.issues.filter((i) => i.path.includes("birthDate"));
          expect(dateErrors.length).toBeGreaterThan(0);
        }
      }),
      { numRuns: 100 }
    );
  });

  it("rejects form data with non-positive weight", () => {
    const nonPositiveWeight = fc.oneof(
      fc.constant("0"),
      fc.constant("-1"),
      fc.constant("-0.5"),
      fc.float({ min: Math.fround(-999), max: Math.fround(0), noNaN: true }).map((n) => n.toFixed(2))
    );

    fc.assert(
      fc.property(validFormData, nonPositiveWeight, (data, weight) => {
        const invalid = { ...data, weight };
        const result = petFormSchema.safeParse(invalid);
        expect(result.success).toBe(false);
        if (!result.success) {
          const weightErrors = result.error.issues.filter((i) => i.path.includes("weight"));
          expect(weightErrors.length).toBeGreaterThan(0);
        }
      }),
      { numRuns: 100 }
    );
  });

  it("rejects form data with non-numeric weight string", () => {
    const nonNumericWeight = fc
      .string({ minLength: 1, maxLength: 10 })
      .filter((s) => isNaN(parseFloat(s)));

    fc.assert(
      fc.property(validFormData, nonNumericWeight, (data, weight) => {
        const invalid = { ...data, weight };
        const result = petFormSchema.safeParse(invalid);
        expect(result.success).toBe(false);
        if (!result.success) {
          const weightErrors = result.error.issues.filter((i) => i.path.includes("weight"));
          expect(weightErrors.length).toBeGreaterThan(0);
        }
      }),
      { numRuns: 100 }
    );
  });

  it("rejects form data with empty weight", () => {
    fc.assert(
      fc.property(validFormData, (data) => {
        const invalid = { ...data, weight: "" };
        const result = petFormSchema.safeParse(invalid);
        expect(result.success).toBe(false);
        if (!result.success) {
          const weightErrors = result.error.issues.filter((i) => i.path.includes("weight"));
          expect(weightErrors.length).toBeGreaterThan(0);
        }
      }),
      { numRuns: 100 }
    );
  });

  it("rejects form data with empty color", () => {
    fc.assert(
      fc.property(validFormData, (data) => {
        const invalid = { ...data, color: "" };
        const result = petFormSchema.safeParse(invalid);
        expect(result.success).toBe(false);
        if (!result.success) {
          const colorErrors = result.error.issues.filter((i) => i.path.includes("color"));
          expect(colorErrors.length).toBeGreaterThan(0);
        }
      }),
      { numRuns: 100 }
    );
  });
});
