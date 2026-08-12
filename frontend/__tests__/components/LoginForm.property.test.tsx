// Feature: login-page-zod-validation, Property 3: Form values preserved on login failure
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import * as fc from "fast-check";
import LoginForm from "@/components/auth/LoginForm";

// Mock next/navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Mock AuthContext with login always returning false
const mockLogin = vi.fn().mockResolvedValue(false);
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    login: mockLogin,
    isAuthenticated: false,
    isLoading: false,
    user: null,
    logout: vi.fn(),
  }),
}));

describe("Feature: login-page-zod-validation, Property 3: Form values preserved on login failure", () => {
  /**
   * **Validates: Requirements 2.7**
   *
   * For any valid email and senha pair that passes client-side validation,
   * if Auth_Context.login returns false, the LoginForm SHALL retain the exact
   * same email and senha values in the input fields without modification.
   */

  beforeEach(() => {
    mockLogin.mockClear();
    mockPush.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it("preserves email and senha values in input fields when login returns false", { timeout: 30000 }, async () => {
    // Generator for valid email addresses
    const alphaNumChar = fc.constantFrom(
      ...'abcdefghijklmnopqrstuvwxyz0123456789'.split('')
    );

    const localPartArb = fc
      .array(alphaNumChar, { minLength: 1, maxLength: 15 })
      .map((chars) => chars.join(""));

    const domainPartArb = fc
      .array(alphaNumChar, { minLength: 1, maxLength: 8 })
      .map((chars) => chars.join(""));

    const tldArb = fc.constantFrom("com", "org", "net", "io", "dev");

    const validEmailArb = fc
      .tuple(localPartArb, domainPartArb, tldArb)
      .map(([local, domain, tld]) => `${local}@${domain}.${tld}`);

    // Generator for valid senha (6-128 chars)
    const validSenhaArb = fc.string({ minLength: 6, maxLength: 50 });

    await fc.assert(
      fc.asyncProperty(validEmailArb, validSenhaArb, async (email, senha) => {
        mockLogin.mockClear();
        mockLogin.mockResolvedValue(false);

        const { unmount } = render(<LoginForm />);

        const emailInput = screen.getByLabelText("Email") as HTMLInputElement;
        const senhaInput = screen.getByLabelText("Senha") as HTMLInputElement;

        // Type email and senha values
        fireEvent.change(emailInput, { target: { value: email } });
        fireEvent.change(senhaInput, { target: { value: senha } });

        // Submit the form
        const submitButton = screen.getByRole("button", { name: /entrar/i });
        fireEvent.click(submitButton);

        // Wait for the login call to resolve and state to update
        await waitFor(() => {
          expect(mockLogin).toHaveBeenCalledWith(email, senha);
        });

        // Wait for isSubmitting to go back to false (button text reverts)
        await waitFor(() => {
          expect(screen.getByRole("button", { name: /entrar/i })).toBeDefined();
        });

        // Assert that email and senha inputs still hold the exact same values
        expect(emailInput.value).toBe(email);
        expect(senhaInput.value).toBe(senha);

        unmount();
      }),
      { numRuns: 20 }
    );
  });
});
