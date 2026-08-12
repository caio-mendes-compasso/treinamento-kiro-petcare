import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Mock next/navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

/**
 * Test consumer component that exposes AuthContext values for assertions.
 */
function TestConsumer() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="user">{user ? JSON.stringify(user) : "null"}</span>
      <span data-testid="isAuthenticated">{String(isAuthenticated)}</span>
      <span data-testid="isLoading">{String(isLoading)}</span>
      <span data-testid="loginType">{typeof login}</span>
      <span data-testid="logoutType">{typeof logout}</span>
      <button
        data-testid="login-btn"
        onClick={async () => {
          const result = await login("test@test.com", "123456");
          document.getElementById("login-result")!.textContent = String(result);
        }}
      />
      <button
        data-testid="login-invalid-btn"
        onClick={async () => {
          const result = await login("test@test.com", "wrongpass");
          document.getElementById("login-result")!.textContent = String(result);
        }}
      />
      <button data-testid="logout-btn" onClick={logout} />
      <span id="login-result" data-testid="login-result" />
    </div>
  );
}

function renderWithProvider(children: ReactNode = <TestConsumer />) {
  return render(<AuthProvider>{children}</AuthProvider>);
}

describe("AuthProvider lifecycle", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    mockPush.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("exposes all correct properties", async () => {
    renderWithProvider();

    // Wait for useEffect to complete (isLoading → false)
    await act(async () => {});

    expect(screen.getByTestId("user").textContent).toBe("null");
    expect(screen.getByTestId("isAuthenticated").textContent).toBe("false");
    expect(screen.getByTestId("isLoading").textContent).toBe("false");
    expect(screen.getByTestId("loginType").textContent).toBe("function");
    expect(screen.getByTestId("logoutType").textContent).toBe("function");
  });

  it("lifecycle: mount → isLoading true → check → isLoading false", async () => {
    // Track isLoading values across renders
    const loadingStates: boolean[] = [];

    function LoadingTracker() {
      const { isLoading } = useAuth();
      loadingStates.push(isLoading);
      return <span data-testid="isLoading">{String(isLoading)}</span>;
    }

    renderWithProvider(<LoadingTracker />);

    // After initial render, isLoading should have been true
    expect(loadingStates[0]).toBe(true);

    // After effect runs, isLoading becomes false
    await act(async () => {});
    expect(loadingStates[loadingStates.length - 1]).toBe(false);
  });

  it("localStorage unavailable does not break app", async () => {
    const originalGetItem = Storage.prototype.getItem;
    Storage.prototype.getItem = vi.fn(() => {
      throw new Error("localStorage unavailable");
    });

    renderWithProvider();
    await act(async () => {});

    expect(screen.getByTestId("isAuthenticated").textContent).toBe("false");
    expect(screen.getByTestId("user").textContent).toBe("null");
    expect(screen.getByTestId("isLoading").textContent).toBe("false");

    Storage.prototype.getItem = originalGetItem;
  });

  it("corrupted JSON in localStorage is handled gracefully", async () => {
    localStorage.setItem("petcare_token", "some-token");
    localStorage.setItem("petcare_user", "not-valid-json{{{");

    renderWithProvider();
    await act(async () => {});

    expect(screen.getByTestId("isAuthenticated").textContent).toBe("false");
    expect(screen.getByTestId("user").textContent).toBe("null");
    expect(screen.getByTestId("isLoading").textContent).toBe("false");
  });

  it("login with valid credentials persists to localStorage", async () => {
    renderWithProvider();
    await act(async () => {});

    // Trigger login
    await act(async () => {
      screen.getByTestId("login-btn").click();
      await vi.advanceTimersByTimeAsync(1000);
    });

    expect(localStorage.getItem("petcare_token")).toBeTruthy();
    const storedUser = JSON.parse(localStorage.getItem("petcare_user")!);
    expect(storedUser).toEqual({
      nome: "Usuário PetCare",
      email: "test@test.com",
    });
    expect(screen.getByTestId("isAuthenticated").textContent).toBe("true");
    expect(screen.getByTestId("user").textContent).toBe(
      JSON.stringify({ nome: "Usuário PetCare", email: "test@test.com" })
    );
  });

  it("logout clears localStorage and redirects to /", async () => {
    // Set up authenticated state in localStorage
    localStorage.setItem("petcare_token", "mock-token-123");
    localStorage.setItem(
      "petcare_user",
      JSON.stringify({ nome: "Usuário PetCare", email: "test@test.com" })
    );

    renderWithProvider();
    await act(async () => {});

    // Verify authenticated state was restored
    expect(screen.getByTestId("isAuthenticated").textContent).toBe("true");

    // Trigger logout
    await act(async () => {
      screen.getByTestId("logout-btn").click();
    });

    expect(localStorage.getItem("petcare_token")).toBeNull();
    expect(localStorage.getItem("petcare_user")).toBeNull();
    expect(screen.getByTestId("isAuthenticated").textContent).toBe("false");
    expect(screen.getByTestId("user").textContent).toBe("null");
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("login with invalid credentials returns false and doesn't change state", async () => {
    renderWithProvider();
    await act(async () => {});

    // Trigger login with wrong password
    await act(async () => {
      screen.getByTestId("login-invalid-btn").click();
      await vi.advanceTimersByTimeAsync(1000);
    });

    expect(screen.getByTestId("login-result").textContent).toBe("false");
    expect(screen.getByTestId("isAuthenticated").textContent).toBe("false");
    expect(screen.getByTestId("user").textContent).toBe("null");
    expect(localStorage.getItem("petcare_token")).toBeNull();
    expect(localStorage.getItem("petcare_user")).toBeNull();
  });

  it("petcare_user exists without petcare_token initializes as unauthenticated", async () => {
    // Only set petcare_user, no token
    localStorage.setItem(
      "petcare_user",
      JSON.stringify({ nome: "Usuário PetCare", email: "test@test.com" })
    );

    renderWithProvider();
    await act(async () => {});

    expect(screen.getByTestId("isAuthenticated").textContent).toBe("false");
    expect(screen.getByTestId("user").textContent).toBe("null");
    expect(screen.getByTestId("isLoading").textContent).toBe("false");
  });
});
