import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { tutorSchema } from "../schemas";

/**
 * Arbitrary that generates digit-only strings with length != 11 (too short or too long).
 */
const wrongLengthDigits = fc.oneof(
  // Too short: 0-10 digits
  fc
    .array(fc.constantFrom("0", "1", "2", "3", "4", "5", "6", "7", "8", "9"), {
      minLength: 0,
      maxLength: 10,
    })
    .map((arr) => arr.join("")),
  // Too long: 12-20 digits
  fc
    .array(fc.constantFrom("0", "1", "2", "3", "4", "5", "6", "7", "8", "9"), {
      minLength: 12,
      maxLength: 20,
    })
    .map((arr) => arr.join(""))
);

/**
 * Arbitrary that generates 11-char strings containing at least one non-digit character.
 */
const elevenCharsWithNonDigit = fc
  .tuple(
    fc.integer({ min: 0, max: 10 }),
    fc.constantFrom("a", "b", "X", "!", "@", " ", ".", "-", "#", "Z")
  )
  .chain(([pos, nonDigit]) =>
    fc
      .array(fc.constantFrom("0", "1", "2", "3", "4", "5", "6", "7", "8", "9"), {
        minLength: 10,
        maxLength: 10,
      })
      .map((digits) => {
        const arr: string[] = [...digits];
        arr.splice(pos, 0, nonDigit);
        return arr.slice(0, 11).join("");
      })
  );

describe("Feature: multi-step-plan-purchase, Property 7: CPF validation rejects non-11-digit strings", () => {
  /**
   * **Validates: Requirements 3.5**
   *
   * For any string that does not consist of exactly 11 numeric digits,
   * the tutorSchema CPF field validation SHALL return a failure result.
   */
  it("rejects digit strings with length != 11", () => {
    fc.assert(
      fc.property(wrongLengthDigits, (input) => {
        const result = tutorSchema.shape.cpf.safeParse(input);
        expect(result.success).toBe(false);
      }),
      { numRuns: 200 }
    );
  });

  it("rejects 11-character strings containing non-digit characters", () => {
    fc.assert(
      fc.property(elevenCharsWithNonDigit, (input) => {
        const result = tutorSchema.shape.cpf.safeParse(input);
        expect(result.success).toBe(false);
      }),
      { numRuns: 200 }
    );
  });

  it("rejects arbitrary strings that don't match exactly 11 digits", () => {
    const arbitraryNonCpf = fc
      .string({ minLength: 0, maxLength: 30 })
      .filter((s) => !/^\d{11}$/.test(s));

    fc.assert(
      fc.property(arbitraryNonCpf, (input) => {
        const result = tutorSchema.shape.cpf.safeParse(input);
        expect(result.success).toBe(false);
      }),
      { numRuns: 200 }
    );
  });
});

describe("Feature: multi-step-plan-purchase, Property 8: Email validation rejects invalid formats", () => {
  /**
   * **Validates: Requirements 3.6**
   *
   * For any string that does not conform to a valid email format
   * (missing @, missing domain, etc.), the tutorSchema email field
   * validation SHALL return a failure result.
   */
  it("rejects strings without @ symbol", () => {
    const noAtSymbol = fc
      .string({ minLength: 1, maxLength: 30 })
      .filter((s) => !s.includes("@"));

    fc.assert(
      fc.property(noAtSymbol, (input) => {
        const result = tutorSchema.shape.email.safeParse(input);
        expect(result.success).toBe(false);
      }),
      { numRuns: 200 }
    );
  });

  it("rejects strings with @ but no valid domain (no dot after @)", () => {
    const atWithoutDotDomain = fc
      .tuple(
        fc.stringMatching(/^[a-z]{1,10}$/),
        fc.stringMatching(/^[a-z]{1,10}$/)
      )
      .map(([local, domain]) => `${local}@${domain}`);

    fc.assert(
      fc.property(atWithoutDotDomain, (input) => {
        const result = tutorSchema.shape.email.safeParse(input);
        expect(result.success).toBe(false);
      }),
      { numRuns: 200 }
    );
  });

  it("rejects empty strings and whitespace-only strings", () => {
    const emptyOrWhitespace = fc.oneof(
      fc.constant(""),
      fc.constant("   "),
      fc.constant("\t"),
      fc.constant("\n")
    );

    fc.assert(
      fc.property(emptyOrWhitespace, (input) => {
        const result = tutorSchema.shape.email.safeParse(input);
        expect(result.success).toBe(false);
      }),
      { numRuns: 10 }
    );
  });

  it("rejects strings with @ but empty local part or domain", () => {
    const missingParts = fc.oneof(
      // Nothing before @
      fc.stringMatching(/^[a-z]{1,10}$/).map((s) => `@${s}.com`),
      // Nothing after @
      fc.stringMatching(/^[a-z]{1,10}$/).map((s) => `${s}@`),
      // Just @
      fc.constant("@")
    );

    fc.assert(
      fc.property(missingParts, (input) => {
        const result = tutorSchema.shape.email.safeParse(input);
        expect(result.success).toBe(false);
      }),
      { numRuns: 100 }
    );
  });
});
