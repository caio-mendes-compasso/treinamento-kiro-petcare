import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as fc from "fast-check";
import { render, act } from "@testing-library/react";
import React from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

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
 * Helper component that exposes auth context values for testing.
 * Uses a ref-style callback to always have the latest context value.
 */
function AuthConsumer({
  contextRef,
}: {
  contextRef: React.MutableRefObject<ReturnType<typeof useAuth> | null>;
}) {
  const ctx = useAuth();
  contextRef.current = ctx;
  return null;
}

describe("Feature: auth-context-route-protection, Property 1: Login and session persistence round-trip", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
  });

  it("login persists session and re-mounting AuthProvider restores user with same nome and email", { timeout: 120000 }, async () => {
    /**
     * **Validates: Requirements 2.3, 2.4, 3.1, 3.2, 3.3**
     *
     * For any valid email (matching regex) and password "123456":
     * 1. Calling login(email, "123456") returns true
     * 2. After unmounting and re-mounting AuthProvider, user is restored
     *    with nome === "Usuário PetCare" and email === generated email
     * 3. isAuthenticated === true after restoration
     */
    await fc.assert(
      fc.asyncProperty(validEmailArbitrary, async (email) => {
        // Clean localStorage between iterations
        localStorage.clear();

        // --- Phase 1: Login ---
        const contextRef1: React.MutableRefObject<ReturnType<typeof useAuth> | null> = { current: null };

        const { unmount } = render(
          <AuthProvider>
            <AuthConsumer contextRef={contextRef1} />
          </AuthProvider>
        );

        // The useEffect runs on mount and sets isLoading to false
        // With fake timers, we need to flush microtasks
        await act(async () => {});

        expect(contextRef1.current!.isLoading).toBe(false);

        // Perform login
        let loginResult: boolean = false;
        await act(async () => {
          const loginPromise = contextRef1.current!.login(email, "123456");
          await vi.advanceTimersByTimeAsync(1000);
          loginResult = await loginPromise;
        });

        // Verify login succeeded
        expect(loginResult).toBe(true);

        // Unmount to simulate page navigation/reload
        unmount();

        // --- Phase 2: Re-mount and verify session restoration ---
        const contextRef2: React.MutableRefObject<ReturnType<typeof useAuth> | null> = { current: null };

        const { unmount: unmount2 } = render(
          <AuthProvider>
            <AuthConsumer contextRef={contextRef2} />
          </AuthProvider>
        );

        // The useEffect reads from localStorage and sets state
        await act(async () => {});

        // Verify loading is done and session was restored correctly
        expect(contextRef2.current!.isLoading).toBe(false);
        expect(contextRef2.current!.user).toEqual({
          nome: "Usuário PetCare",
          email,
        });
        expect(contextRef2.current!.isAuthenticated).toBe(true);

        unmount2();
      }),
      { numRuns: 100 }
    );
  });
});
