import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as fc from "fast-check";
import { mockLogin } from "@/mocks/auth";

/**
 * Custom arbitrary: generates valid email strings matching
 * /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
 *
 * Uses fc.stringMatching to generate parts that conform to the regex constraints:
 * - localpart: 1+ chars, no whitespace or @
 * - domain: 1+ chars, no whitespace, @, or dots
 * - tld: 2+ chars, no whitespace, @, or dots
 */
const validEmailArbitrary = fc
  .tuple(
    fc.stringMatching(/^[^\s@]{1,10}$/),
    fc.stringMatching(/^[^\s@.]{1,10}$/),
    fc.stringMatching(/^[^\s@.]{2,5}$/)
  )
  .map(([local, domain, tld]) => `${local}@${domain}.${tld}`);

describe("Feature: auth-context-route-protection, Property 4: Valid credentials always produce successful authentication", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("mockLogin returns success with correct user for any valid email and password '123456'", async () => {
    /**
     * **Validates: Requirements 3.1, 3.4, 8.4**
     *
     * For any email matching /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/ and password "123456",
     * mockLogin should return { success: true, user: { nome: "Usuário PetCare", email } }
     */
    await fc.assert(
      fc.asyncProperty(validEmailArbitrary, async (email) => {
        const loginPromise = mockLogin(email, "123456");

        // Advance fake timers to resolve the 1000ms delay
        await vi.advanceTimersByTimeAsync(1000);

        const result = await loginPromise;

        expect(result).toEqual({
          success: true,
          user: {
            nome: "Usuário PetCare",
            email,
          },
        });
      }),
      { numRuns: 100 }
    );
  });
});
