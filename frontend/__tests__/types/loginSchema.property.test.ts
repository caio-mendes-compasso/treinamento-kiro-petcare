import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { loginSchema } from "@/types/auth";

// Feature: login-page-zod-validation, Property 1: Email validation correctness
describe("Feature: login-page-zod-validation, Property 1: Email validation correctness", () => {
  /**
   * **Validates: Requirements 1.1**
   *
   * For any string input, the loginSchema SHALL accept it if and only if it is
   * a non-empty string with a maximum length of 254 characters that matches a valid
   * email format; otherwise it SHALL reject it producing the error message "Email inválido".
   */

  it("accepts valid emails (non-empty, max 254 chars, correct format)", () => {
    const alphaNumChar = fc.constantFrom(
      ...'abcdefghijklmnopqrstuvwxyz0123456789'.split('')
    );

    const localPartArb = fc
      .array(alphaNumChar, { minLength: 1, maxLength: 20 })
      .map((chars) => chars.join(""));

    const domainPartArb = fc
      .array(alphaNumChar, { minLength: 1, maxLength: 10 })
      .map((chars) => chars.join(""));

    const tldArb = fc.constantFrom("com", "org", "net", "io", "dev");

    const validEmailArb = fc
      .tuple(localPartArb, domainPartArb, tldArb)
      .map(([local, domain, tld]) => `${local}@${domain}.${tld}`)
      .filter((email) => email.length >= 3 && email.length <= 254);

    fc.assert(
      fc.property(validEmailArb, (email) => {
        const result = loginSchema.shape.email.safeParse(email);
        expect(result.success).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it("rejects empty string with error message 'Email inválido'", () => {
    const result = loginSchema.shape.email.safeParse("");
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain("Email inválido");
    }
  });

  it("rejects strings without valid email format with error message 'Email inválido'", () => {
    const invalidEmailArb = fc
      .string({ minLength: 1, maxLength: 254 })
      .filter((s) => !s.includes("@") || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s));

    fc.assert(
      fc.property(invalidEmailArb, (input) => {
        const result = loginSchema.shape.email.safeParse(input);
        expect(result.success).toBe(false);
        if (!result.success) {
          const messages = result.error.issues.map((i) => i.message);
          expect(messages).toContain("Email inválido");
        }
      }),
      { numRuns: 100 }
    );
  });

  it("rejects strings longer than 254 characters with error message", () => {
    const longStringArb = fc.string({ minLength: 255, maxLength: 400 });

    fc.assert(
      fc.property(longStringArb, (input) => {
        const result = loginSchema.shape.email.safeParse(input);
        expect(result.success).toBe(false);
      }),
      { numRuns: 100 }
    );
  });
});

// Feature: login-page-zod-validation, Property 2: Senha validation correctness
describe("Feature: login-page-zod-validation, Property 2: Senha validation correctness", () => {
  /**
   * **Validates: Requirements 1.2**
   *
   * For any string input, the loginSchema SHALL accept it if and only if it has
   * a length between 6 and 128 characters (inclusive); for strings with fewer than
   * 6 characters, it SHALL produce the error message "Senha deve ter no mínimo 6 caracteres".
   */

  it("accepts any senha with length between 6 and 128 characters", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 6, maxLength: 128 }),
        (senha) => {
          const result = loginSchema.shape.senha.safeParse(senha);
          expect(result.success).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("rejects any senha with fewer than 6 characters with correct error message", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 0, maxLength: 5 }),
        (senha) => {
          const result = loginSchema.shape.senha.safeParse(senha);
          expect(result.success).toBe(false);
          if (!result.success) {
            const messages = result.error.issues.map((i) => i.message);
            expect(messages).toContain(
              "Senha deve ter no mínimo 6 caracteres"
            );
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
