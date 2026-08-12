import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { applyCpfMask, applyPhoneMask, unmask } from "../masks";

/**
 * Arbitrary that generates a string of exactly 11 digit characters.
 */
const elevenDigits = fc
  .array(fc.constantFrom("0", "1", "2", "3", "4", "5", "6", "7", "8", "9"), {
    minLength: 11,
    maxLength: 11,
  })
  .map((arr) => arr.join(""));

describe("Mask Property Tests", () => {
  /**
   * Property 5: CPF mask format
   * Para qualquer string de 11 dígitos, `applyCpfMask` produz formato XXX.XXX.XXX-XX com length 14.
   *
   * **Validates: Requirements 3.2**
   */
  it("Property 5: applyCpfMask produces format XXX.XXX.XXX-XX with length 14 for any 11-digit string", () => {
    fc.assert(
      fc.property(elevenDigits, (digits) => {
        const masked = applyCpfMask(digits);

        // Length must be 14
        expect(masked).toHaveLength(14);

        // Format: XXX.XXX.XXX-XX where X is a digit
        expect(masked).toMatch(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
      })
    );
  });

  /**
   * Property 6: Phone mask format
   * Para qualquer string de 11 dígitos, `applyPhoneMask` produz formato (XX) XXXXX-XXXX com length 15.
   *
   * **Validates: Requirements 3.3**
   */
  it("Property 6: applyPhoneMask produces format (XX) XXXXX-XXXX with length 15 for any 11-digit string", () => {
    fc.assert(
      fc.property(elevenDigits, (digits) => {
        const masked = applyPhoneMask(digits);

        // Length must be 15
        expect(masked).toHaveLength(15);

        // Format: (XX) XXXXX-XXXX where X is a digit
        expect(masked).toMatch(/^\(\d{2}\) \d{5}-\d{4}$/);
      })
    );
  });

  /**
   * Property 13: Mask round-trip preserves digits
   * Para qualquer string de 11 dígitos, `unmask(applyCpfMask(digits)) === digits`
   * e `unmask(applyPhoneMask(digits)) === digits`.
   *
   * **Validates: Requirements 3.2, 3.3**
   */
  it("Property 13: unmask(applyCpfMask(digits)) returns original digits for any 11-digit string", () => {
    fc.assert(
      fc.property(elevenDigits, (digits) => {
        const roundTripped = unmask(applyCpfMask(digits));
        expect(roundTripped).toBe(digits);
      })
    );
  });

  it("Property 13: unmask(applyPhoneMask(digits)) returns original digits for any 11-digit string", () => {
    fc.assert(
      fc.property(elevenDigits, (digits) => {
        const roundTripped = unmask(applyPhoneMask(digits));
        expect(roundTripped).toBe(digits);
      })
    );
  });
});
