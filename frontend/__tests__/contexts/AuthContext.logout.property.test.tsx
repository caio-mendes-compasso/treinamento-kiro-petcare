import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as fc from "fast-check";
import { render, act, waitFor } from "@testing-library/react";
import React from "react";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { User } from "@/types/auth";

/**
 * Test consumer component that exposes AuthContext values and actions
 */
function TestConsumer({
  onContext,
}: {
  onContext: (ctx: ReturnType<typeof useAuth>) => void;
}) {
  const ctx = useAuth();
  onContext(ctx);
  return null;
}

/**
 * Custom arbitrary: generates valid email strings matching
 * /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
 */
const validEmailArbitrary = fc
  .tuple(
    fc.stringMatching(/^[^\s@]{1,10}$/),
    fc.stringMatching(/^[^\s@.]{1,10}$/),
    fc.stringMatching(/^[^\s@.]{2,5}$/)
  )
  .map(([local, domain, tld]) => `${local}@${domain}.${tld}`);

/**
 * Custom arbitrary: generates valid User objects with random email and name
 */
const validUserArbitrary = fc
  .tuple(validEmailArbitrary, fc.string({ minLength: 1, maxLength: 30 }))
  .map(([email, nome]): User => ({ nome, email }));

describe("Feature: auth-context-route-protection, Property 2: Logout always clears authentication state", () => {
  beforeEach(() => {
    localStorage.clear();
    mockPush.mockClear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("logout always clears user, isAuthenticated, localStorage keys, and redirects to /", async () => {
    /**
     * **Validates: Requirements 2.5, 4.1, 4.2**
     *
     * For any authenticated state (with any valid User object stored in context
     * and localStorage), calling logout() should result in user === null,
     * isAuthenticated === false, and both petcare_token and petcare_user
     * removed from localStorage.
     */
    await fc.assert(
      fc.asyncProperty(validUserArbitrary, async (user) => {
        // Pre-populate localStorage so AuthProvider mounts as authenticated
        const token = `mock-token-${Date.now()}`;
        localStorage.setItem("petcare_token", token);
        localStorage.setItem("petcare_user", JSON.stringify(user));

        let contextRef: ReturnType<typeof useAuth> | null = null;

        const { unmount } = render(
          <AuthProvider>
            <TestConsumer
              onContext={(ctx) => {
                contextRef = ctx;
              }}
            />
          </AuthProvider>
        );

        // Wait for AuthProvider to finish loading and hydrate from localStorage
        await waitFor(() => {
          expect(contextRef).not.toBeNull();
          expect(contextRef!.isLoading).toBe(false);
        });

        // Verify initial authenticated state
        expect(contextRef!.isAuthenticated).toBe(true);
        expect(contextRef!.user).toEqual({
          nome: user.nome,
          email: user.email,
        });

        // Execute logout
        act(() => {
          contextRef!.logout();
        });

        // Verify state is cleared
        expect(contextRef!.user).toBeNull();
        expect(contextRef!.isAuthenticated).toBe(false);

        // Verify localStorage is cleared
        expect(localStorage.getItem("petcare_token")).toBeNull();
        expect(localStorage.getItem("petcare_user")).toBeNull();

        // Verify router.push was called with "/"
        expect(mockPush).toHaveBeenCalledWith("/");

        // Clean up between iterations
        unmount();
        localStorage.clear();
        mockPush.mockClear();
      }),
      { numRuns: 100 }
    );
  });
});
